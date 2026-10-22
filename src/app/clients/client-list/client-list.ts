import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { InitialsPipe } from '../../shared/initials.pipe';
import { Client } from '../client.models';
import { ClientsStore, ClientStatusFilter } from '../clients.store';

interface ClientListItem {
  readonly client: Client;
  readonly nextSession: Date | null;
}

@Component({
  selector: 'pmt-client-list',
  imports: [
    DatePipe,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    InitialsPipe,
  ],
  templateUrl: './client-list.html',
  styleUrl: './client-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientList {
  protected readonly store = inject(ClientsStore);

  /** Emits after the user follows a link, so the shell can close an overlay sidenav. */
  readonly navigated = output<void>();

  protected readonly items = computed<ClientListItem[]>(() => {
    const now = Date.now();
    return this.store.filteredClients().map((client) => {
      const upcoming = client.sessions
        .map((session) => new Date(session.start))
        .filter((start) => start.getTime() >= now)
        .sort((a, b) => a.getTime() - b.getTime());
      return { client, nextSession: upcoming[0] ?? null };
    });
  });

  protected onQueryInput(event: Event): void {
    this.store.setQuery((event.target as HTMLInputElement).value);
  }

  protected onStatusChange(value: ClientStatusFilter): void {
    this.store.setStatusFilter(value);
  }

  protected clearQuery(): void {
    this.store.setQuery('');
  }
}
