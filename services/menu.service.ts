import { MenuItemConstructorOptions, shell, BrowserWindow, dialog, app } from 'electron';


export class MenuService {
    constructor (private _window: BrowserWindow) { }

    createMenu(): MenuItemConstructorOptions[] {
        return [
            {},
            {
                label: 'File',
                submenu: this.createFileSubmenu()
            },
            {
                label: 'Edit',
                submenu: this.createEditSubmenu()
            }
        ];
    }

    private createFileSubmenu(): MenuItemConstructorOptions[] {
        return [
            {
                label: 'Open',
                accelerator: 'CmdOrCtrl+O',
                click: async () => {
                    await this.openFile();
                    return Promise.resolve();
                }
            },
            {
                label: 'Quit',
                accelerator: 'CmdOrCtrl+Q',
                click: () => {
                    app.quit();
                }
            }
        ];
    }

    private createEditSubmenu(): MenuItemConstructorOptions[] {
        return [
            {
                label: 'Copy',
                accelerator: 'CmdOrCtrl+C',
                selector: 'copy:'
            },
            {
                label: 'Paste',
                accelerator: 'CmdOrCtrl+V',
                selector: 'paste:'
            },
            {
                label: 'Select All',
                accelerator: 'CmdOrCtrl+A',
                selector: 'selectAll:'
            }
        ];
    }

    private async openFile(): Promise<void> {
        const file = await dialog.showOpenDialog(this._window, {
            title: 'Open File'
        });
        if (file?.length) {
            shell.openItem(file[0]);
        }
        return Promise.resolve();

    }
}