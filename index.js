'use strict';

// Define some constants
const electron   = require('electron');
const ipc        = require('electron').ipcMain;
const app        = electron.app;
const path       = require('path');
const fs         = require('fs');
const appMenuEn  = require('./menu_en');
const appMenuDe  = require('./menu_de');
const storage    = require('./storage');
const acURL      = storage.get('acURL') || 'https://my.activecollab.com/';

// Require download component
require('electron-dl')();

let locale;
let mainWindow;
let isQuitting = false;

function createMainWindow()
{
	// Open window with default size or last window state
	const lastWindowState = storage.get('lastWindowState') || {width: 1024, height: 768};

	const win = new electron.BrowserWindow(
	{
		title: app.getName(),
		show: false,
		x: lastWindowState.x,
		y: lastWindowState.y,
		width: lastWindowState.width,
		height: lastWindowState.height,
		icon: process.platform === 'linux' && path.join(__dirname, 'media', 'Icon.png'),
		minWidth: 800,
		minHeight: 600,
		titleBarStyle: 'default',
		webPreferences:
		{
			nodeIntegration: false,
			preload: path.join(__dirname, 'browser.js'),
			webSecurity: true,
			plugins: false
		}

	});

	win.on('close', function(e)
	{
		if (process.platform == 'darwin' && !isQuitting)
		{
			e.preventDefault();
    		win.hide();

  		}
		else
		{
			app.quit();

		}

	});

	win.loadURL(acURL);
	return win;

}

// App ready callback
app.on('ready', function()
{
	locale     = app.getLocale();
	mainWindow = createMainWindow();

	switch (locale)
	{
		case 'de':
			electron.Menu.setApplicationMenu(appMenuDe);
			break;

		default:
			electron.Menu.setApplicationMenu(appMenuEn);

	}

	const page = mainWindow.webContents;

	page.on('dom-ready', function()
	{
		mainWindow.show();

	});

	page.on('new-window', function(e, url)
	{
		e.preventDefault();
		electron.shell.openExternal(url);

	});

});

app.on('activate', function()
{
	mainWindow.show();

});

app.on('before-quit', function()
{
	isQuitting = true;

	if (!mainWindow.isFullScreen())
	{
		storage.set('lastWindowState', mainWindow.getBounds());

	}

});
