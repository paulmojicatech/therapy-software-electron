const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");
const url = require("url");

let win;

function createWindow() {
  win = new BrowserWindow({ width: 1280, height: 968 });

  // build menu
  let template = [
    {},
    {
      // 'label': 'Clients',
      // 'submenu': [
      //     {
      //         'label': 'Add',
      //         'click': () => {
      //           win.loadURL(
      //             url.format({
      //               pathname: path.join(__dirname, `/dist/index.html/clients/-1`),
      //               protocol: "file:",
      //               slashes: true
      //             })
      //           );
      //         }
      //     }
      // ]
      label: 'Therapy Software',
      submenu: [
        {
          label: 'Exit',
          click: () => {
            app.quit();
          }
        }
      ]
    }
  ];
  
  let menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // load the dist folder from Angular
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/index.html`),
      protocol: "file:",
      slashes: true
    })
  );

  // The following is optional and will open the DevTools:
  //win.webContents.openDevTools()

  win.on("closed", () => {
    win = null;
  });
}

app.on("ready", () => {
  createWindow();
});

// on macOS, closing the window doesn't quit the app
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// initialize the app's main window
app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});