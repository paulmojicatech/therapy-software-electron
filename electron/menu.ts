import { app, BrowserWindow, Menu, type MenuItemConstructorOptions } from 'electron';
import { MENU_COMMAND_CHANNEL, type MenuCommand } from './ipc';

const isMac = process.platform === 'darwin';

function send(command: MenuCommand): void {
  const target = BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0];
  target?.webContents.send(MENU_COMMAND_CHANNEL, command);
}

export function buildApplicationMenu(isDev: boolean): Menu {
  const template: MenuItemConstructorOptions[] = [
    ...(isMac ? [{ role: 'appMenu' } satisfies MenuItemConstructorOptions] : []),
    {
      label: 'File',
      submenu: [
        { label: 'New Client', accelerator: 'CmdOrCtrl+N', click: () => send('new-client') },
        {
          label: 'Email Clients…',
          accelerator: 'CmdOrCtrl+Shift+E',
          click: () => send('compose-email'),
        },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' },
      ],
    },
    { role: 'editMenu' },
    {
      label: 'View',
      submenu: [
        { label: 'Schedule', accelerator: 'CmdOrCtrl+1', click: () => send('show-schedule') },
        { label: 'Go to Today', accelerator: 'CmdOrCtrl+T', click: () => send('today') },
        { label: 'Refresh Clients', accelerator: 'CmdOrCtrl+R', click: () => send('refresh') },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        ...(isDev
          ? ([
              { type: 'separator' },
              { role: 'reload', accelerator: 'CmdOrCtrl+Shift+R' },
              { role: 'toggleDevTools' },
            ] satisfies MenuItemConstructorOptions[])
          : []),
      ],
    },
    { role: 'windowMenu' },
    {
      role: 'help',
      submenu: [
        {
          label: `About ${app.getName()}`,
          click: () => app.showAboutPanel(),
        },
      ],
    },
  ];
  return Menu.buildFromTemplate(template);
}
