import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Client, DISCHARGE_REASONS, DischargeReason } from '../client.models';
import { ClientsStore } from '../clients.store';

export interface DischargeDialogData {
  readonly client: Client;
}

@Component({
  selector: 'pmt-discharge-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title>Discharge {{ data.client.name }}</h2>
    <mat-dialog-content>
      <form class="form" id="discharge-form" [formGroup]="form" (ngSubmit)="submit()">
        <p class="intro">Discharged clients are hidden from the active list and can't be booked.</p>
        <mat-form-field>
          <mat-label>Reason</mat-label>
          <mat-select formControlName="reason" required>
            @for (reason of reasons; track reason) {
              <mat-option [value]="reason">{{ reason }}</mat-option>
            }
          </mat-select>
          <mat-error>Choose a reason</mat-error>
        </mat-form-field>
        <mat-form-field>
          <mat-label>{{ noteRequired() ? 'Describe the reason' : 'Note (optional)' }}</mat-label>
          <textarea matInput rows="4" formControlName="note" [required]="noteRequired()"></textarea>
          <mat-error>Please describe the reason</mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button matButton mat-dialog-close>Cancel</button>
      <button
        matButton="filled"
        type="submit"
        form="discharge-form"
        [disabled]="form.invalid || store.saving()"
      >
        Discharge
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    .form {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .intro {
      margin-top: 0;
      color: var(--mat-sys-on-surface-variant);
    }
  `,
})
export class DischargeDialog {
  private readonly dialogRef = inject(MatDialogRef<DischargeDialog>);
  protected readonly data = inject<DischargeDialogData>(MAT_DIALOG_DATA);
  protected readonly store = inject(ClientsStore);
  protected readonly reasons = DISCHARGE_REASONS;

  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly form = this.fb.group({
    reason: this.fb.control<DischargeReason | null>(null, Validators.required),
    note: [''],
  });

  private readonly reason = toSignal(this.form.controls.reason.valueChanges, {
    initialValue: null,
  });
  protected readonly noteRequired = computed(() => this.reason() === 'Other');

  constructor() {
    this.form.controls.reason.valueChanges.pipe(takeUntilDestroyed()).subscribe((reason) => {
      const note = this.form.controls.note;
      note.setValidators(reason === 'Other' ? Validators.required : null);
      note.updateValueAndValidity();
    });
  }

  protected async submit(): Promise<void> {
    const { reason, note } = this.form.getRawValue();
    if (this.form.invalid || reason === null) {
      return;
    }
    const ok = await this.store.dischargeClient({
      clientId: this.data.client.id,
      reason,
      note: note.trim(),
    });
    if (ok) {
      this.dialogRef.close(true);
    }
  }
}
