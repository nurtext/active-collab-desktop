'use strict';

// Require Electron modules
const app           = require('electron').app;
const shell         = require('electron').shell;
const ipc           = require('electron').ipcMain;
const BrowserWindow = require('electron').BrowserWindow;
const Menu          = require('electron').Menu;

// Require Node modules
const path          = require('path');
const fs            = require('fs');

// Require local modules
const storage       = require('./storage');

// Get URL of ActiveCollab installation
const acURL         = storage.get('acURL') || 'https://my.activecollab.com/';

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
	const win = new BrowserWindow(
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
			Menu.setApplicationMenu(require('./menus/de'));
			break;

		default: // Defaults to English
			Menu.setApplicationMenu(require('./menus/en'));

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

		if (/my\.activecollab\.com/.test(url))
		{
			// Internal links
			mainWindow.loadURL(url);

		}
		else
		{
			// External link
			shell.openExternal(url);

		}

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
