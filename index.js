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

// Function for creating the main window
function createMainWindow()
{
	// Open window with default size or last window state
	const lastWindowState = storage.get('lastWindowState') || {width: 1024, height: 768};

	// Check if window was opened fullscreen
	const isFullscreen = storage.get('isFullscreen') || false;

	// Create new browser window
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

	// Window close callback
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
	win.setFullScreen(isFullscreen);
	
	return win;

}

// App ready callback
app.on('ready', function()
{
	locale = app.getLocale();
	mainWindow = createMainWindow();

	const page = mainWindow.webContents;

	// Set application menu based on locale
	switch (locale)
	{
		case 'de': // German
			electron.Menu.setApplicationMenu(appMenuDe);
			break;

		default: // Defaults to English
			electron.Menu.setApplicationMenu(appMenuEn);

	}

	// Document ready callback
	page.on('dom-ready', function()
	{
		mainWindow.show();

	});

	// New window callback
	page.on('new-window', function(e, url)
	{
		e.preventDefault();
		electron.shell.openExternal(url);

	});

});

// App activate callback
app.on('activate', function()
{
	mainWindow.show();

});

// App before quit callback
app.on('before-quit', function()
{
	isQuitting = true;

	if (!mainWindow.isFullScreen())
	{
		storage.set('lastWindowState', mainWindow.getBounds());
		storage.set('isFullscreen', false);

	}
	else
	{
		storage.set('isFullscreen', true);

	}

});
