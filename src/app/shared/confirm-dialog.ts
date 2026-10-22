import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

export interface ConfirmDialogData {
  readonly title: string;
  readonly message: string;
  readonly confirmLabel?: string;
  readonly destructive?: boolean;
}

@Component({
  selector: 'pmt-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>{{ data.message }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button matButton [mat-dialog-close]="false">Cancel</button>
      <button
        matButton="filled"
        [class.destructive]="data.destructive"
        [mat-dialog-close]="true"
        cdkFocusInitial
      >
        {{ data.confirmLabel ?? 'Confirm' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    .destructive {
      --mat-button-filled-container-color: var(--mat-sys-error);
      --mat-button-filled-label-text-color: var(--mat-sys-on-error);
    }
  `,
})
export class ConfirmDialog {
  protected readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
}

/** Opens a confirmation dialog and resolves to `true` only when the user confirms. */
export async function confirm(dialog: MatDialog, data: ConfirmDialogData): Promise<boolean> {
  const ref = dialog.open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, {
    data,
    width: '420px',
  });
  return (await firstValueFrom(ref.afterClosed())) === true;
}
