import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ClientsStore } from '../clients/clients.store';

@Component({
  selector: 'pmt-compose-email-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSlideToggleModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './compose-email-dialog.html',
  styleUrl: './compose-email-dialog.scss',
})
export class ComposeEmailDialog {
  private readonly dialogRef = inject(MatDialogRef<ComposeEmailDialog>);
  protected readonly store = inject(ClientsStore);

  protected readonly form = inject(NonNullableFormBuilder).group({
    subject: ['', [Validators.required, Validators.maxLength(200)]],
    message: ['', Validators.required],
    isTest: [false],
  });

  /** Only active clients with an email address can receive messages. */
  protected readonly recipients = computed(() =>
    this.store.activeClients().filter((client) => !!client.email),
  );
  protected readonly selectedIds = signal<ReadonlySet<number>>(
    new Set(this.recipients().map((client) => client.id)),
  );
  protected readonly allSelected = computed(
    () => this.selectedIds().size === this.recipients().length && this.recipients().length > 0,
  );
  protected readonly someSelected = computed(
    () => this.selectedIds().size > 0 && !this.allSelected(),
  );

  protected onSelectionChange(event: MatSelectionListChange): void {
    this.selectedIds.set(
      new Set(event.source.selectedOptions.selected.map((option) => option.value as number)),
    );
  }

  protected toggleAll(checked: boolean): void {
    this.selectedIds.set(new Set(checked ? this.recipients().map((client) => client.id) : []));
  }

  protected async send(): Promise<void> {
    if (this.form.invalid || (!this.form.controls.isTest.value && !this.selectedIds().size)) {
      this.form.markAllAsTouched();
      return;
    }
    const { subject, message, isTest } = this.form.getRawValue();
    const ok = await this.store.sendMassEmail({
      subject: subject.trim(),
      message,
      isTest,
      clientIds: [...this.selectedIds()],
    });
    if (ok) {
      this.dialogRef.close(true);
    }
  }
}
