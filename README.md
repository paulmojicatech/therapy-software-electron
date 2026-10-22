# Therapy Software

A desktop app that helps a clinician manage their case load: clients, their insurance details,
and a weekly session calendar. Built with Angular and packaged with Electron. Client data is
stored by the Therapy Software API; the app talks to it over HTTPS.

## Features

- **Schedule**: day, week, and month views. Click an open slot to book a session, or click a
  session to view or cancel it. A "Today" panel lists the day's sessions.
- **Clients**: search by name, email, or phone, and filter by active or discharged status.
  Each client has a profile, insurance details, and their upcoming and past sessions.
- **Discharge**: record a reason and a note when a client is discharged.
- **Email clients**: send an email to active clients you pick, or send a test to yourself first.
- **Light and dark themes**: the app follows your system setting, or you can choose one in the
  top bar.
- **Desktop integration**: menu shortcuts for New Client (`Cmd/Ctrl+N`), Email Clients
  (`Cmd/Ctrl+Shift+E`), Go to Today (`Cmd/Ctrl+T`), and Refresh (`Cmd/Ctrl+R`).

## Tech stack

- Angular 22: standalone components, signals, zoneless change detection, built-in control flow
- Angular Material 22 (Material 3 theming)
- NgRx SignalStore for state
- angular-calendar with date-fns
- Electron 45 with context isolation, sandboxing, a custom `app://` protocol, and a CSP
- Vitest for unit tests

## Getting started

```bash
npm install
cp src/env.example.ts src/env.ts   # then edit the endpoints in src/env.ts
```

`src/env.ts` is git-ignored. It exports the API endpoint URLs; see `src/env.example.ts` for the
full list. Older `env.ts` files that don't export `DischargeClientUri` still work because the
app falls back to the previous default discharge endpoint.

> The packaged app's Content Security Policy only allows API calls over **HTTPS**.

## Scripts

| Command                | Description                                                     |
| ---------------------- | --------------------------------------------------------------- |
| `npm start`            | Run the Angular app in a browser at http://localhost:4200       |
| `npm run electron:dev` | Run the dev server and open it in Electron (with live reload)   |
| `npm run electron`     | Build everything and launch Electron with the production build  |
| `npm test`             | Run the unit tests (Vitest)                                     |
| `npm run build`        | Build the renderer to `dist/renderer`                           |
| `npm run package`      | Build installers for the current OS into `release-builds/`      |
| `npm run package:mac`  | Build a macOS `.dmg`                                            |
| `npm run package:win`  | Build a Windows installer (NSIS)                                |
| `npm run format`       | Format the source code with Prettier                            |

All npm packages are `devDependencies` on purpose. The renderer is bundled by the Angular CLI
and the main process only uses Electron and Node.js built-ins, so electron-builder has no
`node_modules` to ship.

## Project layout

```
electron/            Electron main process, preload script, and application menu
src/app/core/        App-wide services: API endpoints, notifications, theme, desktop bridge
src/app/clients/     Client models, API service and mapper, SignalStore, list and detail UI
src/app/schedule/    Calendar page, schedule store, appointment dialogs
src/app/email/       Dialog for emailing clients
src/app/shared/      Shared helpers (confirm dialog, initials pipe)
```

## Written by

Paul Mojica Technologies
