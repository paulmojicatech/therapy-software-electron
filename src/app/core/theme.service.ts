import { DOCUMENT, effect, inject, Injectable, signal } from '@angular/core';

export type ThemePreference = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'pmt-theme';
const ORDER: readonly ThemePreference[] = ['system', 'light', 'dark'];

function isThemePreference(value: unknown): value is ThemePreference {
  return typeof value === 'string' && (ORDER as readonly string[]).includes(value);
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly preferenceState = signal<ThemePreference>(this.readStoredPreference());

  readonly preference = this.preferenceState.asReadonly();

  constructor() {
    effect(() => {
      const preference = this.preferenceState();
      this.document.documentElement.style.colorScheme =
        preference === 'system' ? 'light dark' : preference;
      this.document.defaultView?.localStorage.setItem(STORAGE_KEY, preference);
    });
  }

  setPreference(preference: ThemePreference): void {
    this.preferenceState.set(preference);
  }

  /** Cycles system → light → dark → system. */
  cycle(): void {
    const next = ORDER[(ORDER.indexOf(this.preferenceState()) + 1) % ORDER.length];
    this.preferenceState.set(next);
  }

  private readStoredPreference(): ThemePreference {
    const stored = this.document.defaultView?.localStorage.getItem(STORAGE_KEY);
    return isThemePreference(stored) ? stored : 'system';
  }
}
