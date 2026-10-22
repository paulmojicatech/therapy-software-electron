import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { NotificationService } from '../core/notification.service';
import { ClientApiService } from './client-api.service';
import { Client, emptyClientDraft } from './client.models';
import { ClientsStore } from './clients.store';

function client(id: number, name: string, overrides: Partial<Client> = {}): Client {
  return {
    ...emptyClientDraft(),
    id,
    name,
    isDischarged: false,
    dischargeReason: null,
    sessions: [],
    ...overrides,
  };
}

describe('ClientsStore', () => {
  let api: Record<keyof ClientApiService, ReturnType<typeof vi.fn>>;
  let notify: { success: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn> };
  let store: InstanceType<typeof ClientsStore>;

  beforeEach(() => {
    api = {
      getClients: vi.fn(),
      addClient: vi.fn(),
      updateClient: vi.fn(),
      deleteClient: vi.fn(),
      dischargeClient: vi.fn(),
      addSession: vi.fn(),
      deleteSession: vi.fn(),
      sendMassEmail: vi.fn(),
      getInsuranceCompanies: vi.fn(),
    };
    notify = { success: vi.fn(), error: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        { provide: ClientApiService, useValue: api },
        { provide: NotificationService, useValue: notify },
      ],
    });
    store = TestBed.inject(ClientsStore);
  });

  it('loads clients sorted by name', async () => {
    api.getClients.mockReturnValue(of([client(1, 'zed'), client(2, 'Amy')]));

    await store.loadClients();

    expect(store.loadStatus()).toBe('loaded');
    expect(store.clients().map((c) => c.name)).toEqual(['Amy', 'zed']);
  });

  it('reports load failures', async () => {
    api.getClients.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 0 })));

    await store.loadClients();

    expect(store.loadStatus()).toBe('error');
    expect(notify.error).toHaveBeenCalledWith('Could not load clients', expect.anything());
  });

  it('filters by status and search query', async () => {
    api.getClients.mockReturnValue(
      of([
        client(1, 'Amy Adams', { email: 'amy@example.com' }),
        client(2, 'Bob Brown', { isDischarged: true }),
        client(3, 'Cara Diaz'),
      ]),
    );
    await store.loadClients();

    expect(store.filteredClients().map((c) => c.id)).toEqual([1, 3]);

    store.setStatusFilter('discharged');
    expect(store.filteredClients().map((c) => c.id)).toEqual([2]);

    store.setStatusFilter('all');
    store.setQuery('EXAMPLE.com');
    expect(store.filteredClients().map((c) => c.id)).toEqual([1]);
  });

  it('adds and removes sessions without touching other clients', async () => {
    api.getClients.mockReturnValue(of([client(1, 'Amy'), client(2, 'Bob')]));
    await store.loadClients();
    const start = new Date('2026-10-23T14:00:00.000Z');
    api.addSession.mockReturnValue(of({ id: 99, start: start.toISOString() }));
    api.deleteSession.mockReturnValue(of(undefined));

    expect(await store.addSession(1, start)).toBe(true);
    expect(store.clientById(1)?.sessions).toEqual([{ id: 99, start: start.toISOString() }]);
    expect(store.clientById(2)?.sessions).toEqual([]);

    expect(await store.deleteSession(1, 99)).toBe(true);
    expect(store.clientById(1)?.sessions).toEqual([]);
  });

  it('keeps known sessions when an update response omits them', async () => {
    const session = { id: 5, start: '2026-10-23T14:00:00.000Z' };
    api.getClients.mockReturnValue(of([client(1, 'Amy', { sessions: [session] })]));
    await store.loadClients();
    api.updateClient.mockReturnValue(of(client(1, 'Amy', { phone: '555' })));

    expect(await store.updateClient(1, { ...emptyClientDraft(), name: 'Amy', phone: '555' })).toBe(
      true,
    );

    expect(store.clientById(1)).toMatchObject({ phone: '555', sessions: [session] });
    expect(store.saving()).toBe(false);
  });

  it('marks a client as discharged', async () => {
    api.getClients.mockReturnValue(of([client(1, 'Amy')]));
    await store.loadClients();
    api.dischargeClient.mockReturnValue(of(undefined));

    await store.dischargeClient({ clientId: 1, reason: 'Case closed', note: '' });

    expect(store.clientById(1)).toMatchObject({
      isDischarged: true,
      dischargeReason: 'Case closed',
    });
    expect(store.activeClients()).toEqual([]);
  });

  it('returns false and notifies when a mutation fails', async () => {
    api.deleteClient.mockReturnValue(throwError(() => new Error('boom')));

    expect(await store.deleteClient(1)).toBe(false);
    expect(notify.error).toHaveBeenCalledWith('Could not delete client', expect.any(Error));
    expect(store.saving()).toBe(false);
  });
});
