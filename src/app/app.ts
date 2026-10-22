import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { map } from 'rxjs';
import { ClientList } from './clients/client-list/client-list';
import { ClientsStore } from './clients/clients.store';
import { DesktopBridge, MenuCommand } from './core/desktop-bridge';
import { ThemeService } from './core/theme.service';
import { ComposeEmailDialog } from './email/compose-email-dialog';
import { ScheduleStore } from './schedule/schedule.store';

const THEME_ICONS = { system: 'brightness_auto', light: 'light_mode', dark: 'dark_mode' } as const;

@Component({
  selector: 'pmt-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressBarModule,
    ClientList,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly schedule = inject(ScheduleStore);
  protected readonly clients = inject(ClientsStore);
  protected readonly theme = inject(ThemeService);

  protected readonly isCompact = toSignal(
    inject(BreakpointObserver)
      .observe('(max-width: 900px)')
      .pipe(map((state) => state.matches)),
    { initialValue: false },
  );
  protected readonly themeIcon = computed(() => THEME_ICONS[this.theme.preference()]);
  protected readonly themeLabel = computed(() => `Theme: ${this.theme.preference()}`);

  constructor() {
    void this.clients.loadClients();
    inject(DesktopBridge).onMenuCommand((command) => this.handleMenuCommand(command));
  }

  protected refresh(): void {
    void this.clients.loadClients();
  }

  protected composeEmail(): void {
    this.dialog.open(ComposeEmailDialog, {
      width: '720px',
      maxWidth: '95vw',
      autoFocus: 'first-tabbable',
    });
  }

  private handleMenuCommand(command: MenuCommand): void {
    switch (command) {
      case 'new-client':
        void this.router.navigate(['/clients', 'new']);
        break;
      case 'compose-email':
        this.composeEmail();
        break;
      case 'refresh':
        this.refresh();
        break;
      case 'show-schedule':
        void this.router.navigate(['/schedule']);
        break;
      case 'today':
        this.schedule.goToToday();
        void this.router.navigate(['/schedule']);
        break;
    }
  }
}
