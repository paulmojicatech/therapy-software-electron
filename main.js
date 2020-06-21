const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");
const url = require("url");
const MenuService = require("./services/menu.service");

let win;
let menuSvc;

function createWindow() {
  win = new BrowserWindow({ width: 1280, height: 968 });
  menuSvc = new MenuService.MenuService(win);

  // build menu
  let template = menuSvc.createMenu();
  
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