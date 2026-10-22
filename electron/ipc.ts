/**
 * IPC contract shared by the main process and the preload script.
 * Keep `MenuCommand` in sync with `src/app/core/desktop-bridge.ts`.
 */
export const MENU_COMMAND_CHANNEL = 'menu:command';

export type MenuCommand = 'new-client' | 'compose-email' | 'refresh' | 'show-schedule' | 'today';
