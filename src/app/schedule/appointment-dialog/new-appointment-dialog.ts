import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { Client } from '../../clients/client.models';
import { ClientsStore } from '../../clients/clients.store';
import { DAY_END_HOUR, DAY_START_HOUR } from '../appointments';

export interface NewAppointmentDialogData {
  readonly start: Date;
  readonly clientId?: number;
}

function requireClient(control: AbstractControl<Client | string | null>): ValidationErrors | null {
  return typeof control.value === 'object' && control.value !== null ? null : { client: true };
}

const pad = (value: number): string => String(value).padStart(2, '0');

@Component({
  selector: 'pmt-new-appointment-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTimepickerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title>Book a session</h2>
    <mat-dialog-content>
      <form class="form" [formGroup]="form" id="new-appointment-form" (ngSubmit)="book()">
        <mat-form-field>
          <mat-label>Client</mat-label>
          <mat-icon matPrefix>person</mat-icon>
          <input matInput formControlName="client" [matAutocomplete]="clientAuto" />
          <mat-autocomplete #clientAuto [displayWith]="displayClient" autoActiveFirstOption>
            @for (client of matchingClients(); track client.id) {
              <mat-option [value]="client">{{ client.name }}</mat-option>
            } @empty {
              <mat-option disabled>No matching active clients</mat-option>
            }
          </mat-autocomplete>
          @if (form.controls.client.hasError('client')) {
            <mat-error>Choose a client from the list</mat-error>
          }
        </mat-form-field>

        <div class="row">
          <mat-form-field>
            <mat-label>Date</mat-label>
            <input matInput formControlName="start" [matDatepicker]="datepicker" [min]="today" />
            <mat-datepicker-toggle matIconSuffix [for]="datepicker" />
            <mat-datepicker #datepicker />
          </mat-form-field>

          <mat-form-field>
            <mat-label>Time</mat-label>
            <input
              matInput
              formControlName="start"
              [matTimepicker]="timepicker"
              [matTimepickerMin]="minTime"
              [matTimepickerMax]="maxTime"
            />
            <mat-timepicker-toggle matIconSuffix [for]="timepicker" />
            <mat-timepicker #timepicker interval="30m" />
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button matButton mat-dialog-close>Cancel</button>
      <button
        matButton="filled"
        type="submit"
        form="new-appointment-form"
        [disabled]="form.invalid || store.saving()"
      >
        Book session
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    .form {
      display: flex;
      flex-direction: column;
      padding-top: 8px;
    }
    .row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
  `,
})
export class NewAppointmentDialog {
  private readonly dialogRef = inject(MatDialogRef<NewAppointmentDialog>);
  private readonly data = inject<NewAppointmentDialogData>(MAT_DIALOG_DATA);
  protected readonly store = inject(ClientsStore);

  protected readonly today = new Date(new Date().setHours(0, 0, 0, 0));
  protected readonly minTime = `${pad(DAY_START_HOUR)}:00`;
  protected readonly maxTime = `${pad(DAY_END_HOUR - 1)}:30`;

  protected readonly form = inject(NonNullableFormBuilder).group({
    client: [
      (this.data.clientId !== undefined ? this.store.clientById(this.data.clientId) : null) as
        Client | string | null,
      requireClient,
    ],
    start: [this.data.start, Validators.required],
  });

  private readonly clientQuery = toSignal(this.form.controls.client.valueChanges, {
    initialValue: this.form.controls.client.value,
  });

  protected readonly matchingClients = computed(() => {
    const query = this.clientQuery();
    const needle = typeof query === 'string' ? query.trim().toLocaleLowerCase() : '';
    return this.store
      .activeClients()
      .filter((client) => client.name.toLocaleLowerCase().includes(needle));
  });

  protected displayClient(client: Client | string | null): string {
    return typeof client === 'string' ? client : (client?.name ?? '');
  }

  protected async book(): Promise<void> {
    const { client, start } = this.form.getRawValue();
    if (this.form.invalid || typeof client !== 'object' || client === null) {
      return;
    }
    if (await this.store.addSession(client.id, start)) {
      this.dialogRef.close(true);
    }
  }
}
