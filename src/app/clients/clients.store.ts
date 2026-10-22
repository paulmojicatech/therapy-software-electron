import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Observable, firstValueFrom } from 'rxjs';
import { NotificationService } from '../core/notification.service';
import { ClientApiService } from './client-api.service';
import {
  Client,
  ClientDraft,
  DischargeRequest,
  InsuranceCompany,
  MassEmailRequest,
  compareClientsByName,
} from './client.models';

export type ClientStatusFilter = 'active' | 'discharged' | 'all';
export type LoadStatus = 'idle' | 'loading' | 'loaded' | 'error';

export interface ClientsState {
  readonly clients: readonly Client[];
  readonly insuranceCompanies: readonly InsuranceCompany[];
  readonly loadStatus: LoadStatus;
  /** True while a create/update/delete request is in flight. */
  readonly saving: boolean;
  readonly query: string;
  readonly statusFilter: ClientStatusFilter;
}

const initialState: ClientsState = {
  clients: [],
  insuranceCompanies: [],
  loadStatus: 'idle',
  saving: false,
  query: '',
  statusFilter: 'active',
};

function sortByName(clients: readonly Client[]): Client[] {
  return [...clients].sort(compareClientsByName);
}

function matchesQuery(client: Client, query: string): boolean {
  if (!query) {
    return true;
  }
  const needle = query.toLocaleLowerCase();
  return [client.name, client.email, client.phone].some((value) =>
    value.toLocaleLowerCase().includes(needle),
  );
}

export const ClientsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ clients, query, statusFilter, loadStatus }) => ({
    isLoading: computed(() => loadStatus() === 'loading'),
    activeClients: computed(() => clients().filter((client) => !client.isDischarged)),
    filteredClients: computed(() => {
      const trimmedQuery = query().trim();
      const filter = statusFilter();
      return clients().filter(
        (client) =>
          (filter === 'all' || client.isDischarged === (filter === 'discharged')) &&
          matchesQuery(client, trimmedQuery),
      );
    }),
  })),
  withMethods((store) => {
    const api = inject(ClientApiService);
    const notify = inject(NotificationService);

    const replaceClient = (updated: Client): void =>
      patchState(store, ({ clients }) => ({
        clients: sortByName(
          clients.map((client) =>
            client.id === updated.id
              ? // Some API responses omit sessions; keep the ones we already know about.
                {
                  ...updated,
                  sessions: updated.sessions.length ? updated.sessions : client.sessions,
                }
              : client,
          ),
        ),
      }));

    /** Runs a mutating request, toggling `saving` and reporting failures. */
    async function mutate<T>(
      request: Observable<T>,
      failureMessage: string,
    ): Promise<{ ok: true; value: T } | { ok: false }> {
      patchState(store, { saving: true });
      try {
        return { ok: true, value: await firstValueFrom(request) };
      } catch (error) {
        notify.error(failureMessage, error);
        return { ok: false };
      } finally {
        patchState(store, { saving: false });
      }
    }

    return {
      clientById(id: number): Client | undefined {
        return store.clients().find((client) => client.id === id);
      },

      setQuery(query: string): void {
        patchState(store, { query });
      },

      setStatusFilter(statusFilter: ClientStatusFilter): void {
        patchState(store, { statusFilter });
      },

      async loadClients(): Promise<void> {
        patchState(store, { loadStatus: 'loading' });
        try {
          const clients = await firstValueFrom(api.getClients());
          patchState(store, { clients: sortByName(clients), loadStatus: 'loaded' });
        } catch (error) {
          patchState(store, { loadStatus: 'error' });
          notify.error('Could not load clients', error);
        }
      },

      async loadInsuranceCompanies(): Promise<void> {
        if (store.insuranceCompanies().length) {
          return;
        }
        try {
          const companies = await firstValueFrom(api.getInsuranceCompanies());
          patchState(store, {
            insuranceCompanies: [...companies].sort((a, b) => a.name.localeCompare(b.name)),
          });
        } catch (error) {
          notify.error('Could not load insurance companies', error);
        }
      },

      async addClient(draft: ClientDraft): Promise<Client | null> {
        const result = await mutate(api.addClient(draft), 'Could not add client');
        if (!result.ok) {
          return null;
        }
        patchState(store, ({ clients }) => ({ clients: sortByName([...clients, result.value]) }));
        notify.success(`${result.value.name} was added`);
        return result.value;
      },

      async updateClient(clientId: number, draft: ClientDraft): Promise<boolean> {
        const result = await mutate(api.updateClient(clientId, draft), 'Could not save client');
        if (result.ok) {
          replaceClient(result.value);
          notify.success('Client saved');
        }
        return result.ok;
      },

      async deleteClient(clientId: number): Promise<boolean> {
        const result = await mutate(api.deleteClient(clientId), 'Could not delete client');
        if (result.ok) {
          patchState(store, ({ clients }) => ({
            clients: clients.filter((client) => client.id !== clientId),
          }));
          notify.success('Client deleted');
        }
        return result.ok;
      },

      async dischargeClient(request: DischargeRequest): Promise<boolean> {
        const result = await mutate(api.dischargeClient(request), 'Could not discharge client');
        if (result.ok) {
          patchState(store, ({ clients }) => ({
            clients: clients.map((client) =>
              client.id === request.clientId
                ? { ...client, isDischarged: true, dischargeReason: request.reason }
                : client,
            ),
          }));
          notify.success('Client discharged');
        }
        return result.ok;
      },

      async addSession(clientId: number, start: Date): Promise<boolean> {
        const result = await mutate(api.addSession(clientId, start), 'Could not book appointment');
        if (result.ok) {
          const session = result.value;
          patchState(store, ({ clients }) => ({
            clients: clients.map((client) =>
              client.id === clientId
                ? { ...client, sessions: [...client.sessions, session] }
                : client,
            ),
          }));
          notify.success('Appointment booked');
        }
        return result.ok;
      },

      async deleteSession(clientId: number, sessionId: number): Promise<boolean> {
        const result = await mutate(
          api.deleteSession(clientId, sessionId),
          'Could not cancel appointment',
        );
        if (result.ok) {
          patchState(store, ({ clients }) => ({
            clients: clients.map((client) =>
              client.id === clientId
                ? { ...client, sessions: client.sessions.filter((s) => s.id !== sessionId) }
                : client,
            ),
          }));
          notify.success('Appointment cancelled');
        }
        return result.ok;
      },

      async sendMassEmail(request: MassEmailRequest): Promise<boolean> {
        const result = await mutate(api.sendMassEmail(request), 'Could not send email');
        if (result.ok) {
          const count = request.clientIds.length;
          notify.success(
            request.isTest
              ? 'Test email sent'
              : `Email sent to ${count} client${count === 1 ? '' : 's'}`,
          );
        }
        return result.ok;
      },
    };
  }),
);
