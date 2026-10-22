import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ClientsStore } from '../../clients/clients.store';
import { confirm } from '../../shared/confirm-dialog';
import { InitialsPipe } from '../../shared/initials.pipe';
import { Appointment } from '../appointments';

export interface AppointmentDialogData {
  readonly appointment: Appointment;
}

@Component({
  selector: 'pmt-appointment-dialog',
  imports: [DatePipe, RouterLink, MatDialogModule, MatButtonModule, MatIconModule, InitialsPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div mat-dialog-title class="title">
      <span class="avatar">{{ appointment.title | initials }}</span>
      <span>{{ appointment.title }}</span>
    </div>
    <mat-dialog-content>
      <p class="row">
        <mat-icon>event</mat-icon>
        {{ appointment.start | date: 'EEEE, MMMM d, y' }}
      </p>
      <p class="row">
        <mat-icon>schedule</mat-icon>
        {{ appointment.start | date: 'h:mm a' }} – {{ appointment.end | date: 'h:mm a' }}
      </p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button matButton class="danger" [disabled]="store.saving()" (click)="cancelSession()">
        <mat-icon>event_busy</mat-icon>
        Cancel session
      </button>
      <span class="pmt-spacer"></span>
      <a matButton="tonal" [routerLink]="['/clients', appointment.meta?.clientId]" mat-dialog-close>
        View client
      </a>
      <button matButton mat-dialog-close cdkFocusInitial>Close</button>
    </mat-dialog-actions>
  `,
  styles: `
    .title {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .avatar {
      display: grid;
      place-items: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--mat-sys-secondary-container);
      color: var(--mat-sys-on-secondary-container);
      font: var(--mat-sys-label-large);
    }
    .row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .danger {
      --mat-button-text-label-text-color: var(--mat-sys-error);
    }
  `,
})
export class AppointmentDialog {
  private readonly dialog = inject(MatDialog);
  private readonly dialogRef = inject(MatDialogRef<AppointmentDialog>);
  protected readonly store = inject(ClientsStore);
  protected readonly appointment = inject<AppointmentDialogData>(MAT_DIALOG_DATA).appointment;

  protected async cancelSession(): Promise<void> {
    const meta = this.appointment.meta;
    if (!meta) {
      return;
    }
    const confirmed = await confirm(this.dialog, {
      title: 'Cancel session?',
      message: `This removes ${meta.clientName}'s session from the calendar.`,
      confirmLabel: 'Cancel session',
      destructive: true,
    });
    if (confirmed && (await this.store.deleteSession(meta.clientId, meta.sessionId))) {
      this.dialogRef.close();
    }
  }
}
