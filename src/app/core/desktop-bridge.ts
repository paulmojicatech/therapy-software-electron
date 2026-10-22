import { DestroyRef, DOCUMENT, inject, Injectable } from '@angular/core';

/** Commands the Electron application menu can send to the renderer. */
export type MenuCommand = 'new-client' | 'compose-email' | 'refresh' | 'show-schedule' | 'today';

/** Shape of the API exposed by `electron/preload.ts` via `contextBridge`. */
export interface DesktopApi {
  readonly platform: string;
  onMenuCommand(listener: (command: MenuCommand) => void): () => void;
}

/** Wraps the optional Electron preload API so the app also runs in a plain browser. */
@Injectable({ providedIn: 'root' })
export class DesktopBridge {
  private readonly destroyRef = inject(DestroyRef);
  private readonly api = (
    inject(DOCUMENT).defaultView as (Window & { desktop?: DesktopApi }) | null
  )?.desktop;

  readonly isDesktop = this.api !== undefined;
  readonly platform = this.api?.platform ?? 'web';

  onMenuCommand(listener: (command: MenuCommand) => void): void {
    const unsubscribe = this.api?.onMenuCommand(listener);
    if (unsubscribe) {
      this.destroyRef.onDestroy(unsubscribe);
    }
  }
}
