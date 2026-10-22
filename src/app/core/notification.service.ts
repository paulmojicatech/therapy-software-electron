import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  success(message: string): void {
    this.snackBar.open(message, undefined, { duration: 3000 });
  }

  error(message: string, cause?: unknown): void {
    if (cause !== undefined) {
      console.error(message, cause);
    }
    const detail = describeError(cause);
    this.snackBar.open(detail ? `${message}: ${detail}` : message, 'Dismiss', {
      duration: 8000,
      panelClass: 'pmt-snackbar-error',
    });
  }
}

export function describeError(cause: unknown): string | null {
  if (cause instanceof HttpErrorResponse) {
    if (cause.status === 0) {
      return 'the server could not be reached';
    }
    return `${cause.status} ${cause.statusText}`.trim();
  }
  if (cause instanceof Error) {
    return cause.message;
  }
  return null;
}
