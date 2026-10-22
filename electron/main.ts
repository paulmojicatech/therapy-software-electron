import { app, BrowserWindow, Menu, nativeTheme, net, protocol, shell } from 'electron';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { buildApplicationMenu } from './menu';

/**
 * When set (by `npm run electron:dev`), the window loads the Angular dev server
 * instead of the built files.
 */
const devServerUrl = process.env['ELECTRON_START_URL'];
const isDev = !!devServerUrl;

/** Built Angular app, served through the custom `app://` protocol. */
const RENDERER_ROOT = path.join(__dirname, '..', 'renderer');
const APP_SCHEME = 'app';
const APP_ORIGIN = `${APP_SCHEME}://therapy`;

/**
 * Applied to every response served from `app://`. API calls are allowed to any
 * HTTPS origin because endpoints are configured per install in `src/env.ts`.
 */
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data:",
  "connect-src 'self' https:",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
].join('; ');

protocol.registerSchemesAsPrivileged([
  {
    scheme: APP_SCHEME,
    privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true },
  },
]);

let mainWindow: BrowserWindow | null = null;

async function isFile(filePath: string): Promise<boolean> {
  try {
    return (await stat(filePath)).isFile();
  } catch {
    return false;
  }
}

/** Serves the Angular build, falling back to index.html so client-side routes work. */
function registerAppProtocol(): void {
  protocol.handle(APP_SCHEME, async (request) => {
    const { pathname } = new URL(request.url);
    const requested = path.normalize(path.join(RENDERER_ROOT, decodeURIComponent(pathname)));

    // Never serve anything outside the renderer folder.
    const insideRoot = requested.startsWith(RENDERER_ROOT + path.sep);
    const target =
      insideRoot && (await isFile(requested)) ? requested : path.join(RENDERER_ROOT, 'index.html');

    const response = await net.fetch(pathToFileURL(target).toString());
    const headers = new Headers(response.headers);
    headers.set('Content-Security-Policy', CONTENT_SECURITY_POLICY);
    return new Response(response.body, { status: response.status, headers });
  });
}

function isAppUrl(url: string): boolean {
  return url.startsWith(`${APP_ORIGIN}/`) || (!!devServerUrl && url.startsWith(devServerUrl));
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 960,
    minHeight: 640,
    show: false,
    title: 'Therapy Software',
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#191c1d' : '#f4fafb',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: true,
    },
  });

  mainWindow.once('ready-to-show', () => mainWindow?.show());

  // Open external links in the user's browser and never navigate the app window away.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://') || url.startsWith('mailto:')) {
      void shell.openExternal(url);
    }
    return { action: 'deny' };
  });
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!isAppUrl(url)) {
      event.preventDefault();
    }
  });

  void mainWindow.loadURL(devServerUrl ?? `${APP_ORIGIN}/`);

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.focus();
    }
  });

  app.setAboutPanelOptions({
    applicationName: 'Therapy Software',
    copyright: '© Paul Mojica Technologies',
  });

  void app.whenReady().then(() => {
    registerAppProtocol();
    Menu.setApplicationMenu(buildApplicationMenu(isDev));
    createWindow();

    // On macOS, re-create a window when the dock icon is clicked and none are open.
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}
