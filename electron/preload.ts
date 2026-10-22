import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron';
import type { MenuCommand } from './ipc';

// Sandboxed preloads can't `require` local modules, so the channel name is
// duplicated here instead of imported from ./ipc.
const MENU_COMMAND_CHANNEL = 'menu:command';

/**
 * Minimal, explicit API exposed to the renderer. The renderer never gets direct
 * access to `ipcRenderer` or Node.js.
 */
contextBridge.exposeInMainWorld('desktop', {
  platform: process.platform,
  onMenuCommand(listener: (command: MenuCommand) => void): () => void {
    const handler = (_event: IpcRendererEvent, command: MenuCommand): void => listener(command);
    ipcRenderer.on(MENU_COMMAND_CHANNEL, handler);
    return () => ipcRenderer.removeListener(MENU_COMMAND_CHANNEL, handler);
  },
});
