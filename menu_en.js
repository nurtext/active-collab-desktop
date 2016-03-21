'use strict';

const os            = require('os');
const electron      = require('electron');
const app           = electron.app;
const BrowserWindow = electron.BrowserWindow;
const shell         = electron.shell;
const appName       = app.getName();

let tpl;

// Send IPC commands to browser window
function sendAction(action)
{
	const win = BrowserWindow.getAllWindows()[0];

	if (process.platform === 'darwin')
	{
		win.restore();

	}

	win.webContents.send(action);

}

// Template for Mac OS X
const darwinTpl = [
{
	label: appName,
	submenu: [
		{
			label: `About ${appName}`,
			role: 'about'
		},
		{
			type: 'separator'
		},
		{
			label: 'Preferences …',
			accelerator: 'Cmd+,',
			click: function() {
				sendAction('preferences');
			}
		},
		{
			label: 'User Profile …',
			accelerator: 'Cmd+Alt+,',
			click: function() {
				sendAction('profile');
			}
		},
		{
			type: 'separator'
		},
		{
			label: 'Services',
			role: 'services',
			submenu: []
		},
		{
			type: 'separator'
		},
		{
			label: `Hide ${appName}`,
			accelerator: 'Cmd+H',
			role: 'hide'
		},
		{
			label: 'Hide Others',
			accelerator: 'Cmd+Shift+H',
			role: 'hideothers'
		},
		{
			label: 'Show All',
			role: 'unhide'
		},
		{
			type: 'separator'
		},
		{
			label: `Quit ${appName}`,
			accelerator: 'Cmd+Q',
			click: function() {
				app.quit();
			}
		}
	]
},
{
	label: 'File',
	submenu: [
		{
			label: 'New Project',
			accelerator: 'CmdOrCtrl+N',
			click: function() {
				sendAction('new-project');
			}
		},
		{
			label: 'Find …',
			accelerator: 'CmdOrCtrl+F',
			click: function() {
				sendAction('find');
			}
		},
		{
			type: 'separator'
		},
		{
			label: 'Log out',
			click: function() {
				sendAction('logout');
			}
		}
	]
},
{
	label: 'Edit',
	submenu: [
		{
			label: 'Undo',
			accelerator: 'CmdOrCtrl+Z',
			role: 'undo'
		},
		{
			label: 'Redo',
			accelerator: 'Shift+CmdOrCtrl+Z',
			role: 'redo'
		},
		{
			type: 'separator'
		},
		{
			label: 'Cut',
			accelerator: 'CmdOrCtrl+X',
			role: 'cut'
		},
		{
			label: 'Copy',
			accelerator: 'CmdOrCtrl+C',
			role: 'copy'
		},
		{
			label: 'Paste',
			accelerator: 'CmdOrCtrl+V',
			role: 'paste'
		},
		{
			label: 'Select All',
			accelerator: 'CmdOrCtrl+A',
			role: 'selectall'
		}
	]
},
{
	label: 'View',
	submenu: [
		{
			label: 'Projects',
			accelerator: 'CmdOrCtrl+1',
			click: function() {
				sendAction('goto-projects');
			}
		},
		{
			label: 'My Work',
			accelerator: 'CmdOrCtrl+2',
			click: function() {
				sendAction('goto-my-work');
			}
		},
		{
			label: 'Activity',
			accelerator: 'CmdOrCtrl+3',
			click: function() {
				sendAction('goto-activity');
			}
		},
		{
			label: 'Calendar',
			accelerator: 'CmdOrCtrl+4',
			click: function() {
				sendAction('goto-calendar');
			}
		},
		{
			label: 'People',
			accelerator: 'CmdOrCtrl+5',
			click: function() {
				sendAction('goto-people');
			}
		},
		{
			label: 'Invoices',
			accelerator: 'CmdOrCtrl+6',
			click: function() {
				sendAction('goto-invoices');
			}
		},
		{
			label: 'Estimates',
			accelerator: 'CmdOrCtrl+7',
			click: function() {
				sendAction('goto-estimates');
			}
		},
		{
			type: 'separator'
		},
		{
			label: 'Reports',
			accelerator: 'CmdOrCtrl+8',
			click: function() {
				sendAction('goto-reports');
			}
		},
		{
			label: 'Trash',
			accelerator: 'CmdOrCtrl+9',
			click: function() {
				sendAction('goto-trash');
			}
		},
		{
			type: 'separator'
		},
		{
			label: 'Completed Projects',
			accelerator: 'CmdOrCtrl+0',
			click: function() {
				sendAction('goto-completed-projects');
			}
		},
		{
			type: 'separator'
		},
		{
			label: 'Reload',
			accelerator: 'CmdOrCtrl+R',
			click: function() {
				const win = BrowserWindow.getAllWindows()[0];
				win.webContents.reload();
			}
		}
	]
},
{
	label: 'Window',
	role: 'window',
	submenu: [
		{
			label: 'Minimize',
			accelerator: 'CmdOrCtrl+M',
			role: 'minimize'
		},
		{
			label: 'Close',
			accelerator: 'CmdOrCtrl+W',
			role: 'close'
		},
		{
			type: 'separator'
		},
		{
			label: 'Bring All to Front',
			role: 'front'
		},
		{
			label: 'Toggle Full Screen',
			accelerator: 'Ctrl+Cmd+F',
			click: function() {
				const win = BrowserWindow.getAllWindows()[0];
				win.setFullScreen(!win.isFullScreen());
			}
		}
	]
},
{
	label: 'Help',
	role: 'help'
}];

// Template for Linux/Windows
const linuxTpl = [
{
	label: 'File',
	submenu: [
		{
			label: 'New Project',
			accelerator: 'CmdOrCtrl+N',
			click: function() {
				sendAction('new-project');
			}
		},
		{
			label: 'Find ...',
			accelerator: 'CmdOrCtrl+F',
			click: function() {
				sendAction('find');
			}
		},
		{
			type: 'separator'
		},
		{
			label: 'Log out',
			click: function() {
				sendAction('logout');
			}
		},
		{
			type: 'separator'
		},
		{
			label: 'Quit',
			accelerator: 'Alt+F4',
			click: function() {
				app.quit();
			}
		}
	]
},
{
	label: 'Edit',
	submenu: [
		{
			label: 'Cut',
			accelerator: 'CmdOrCtrl+X',
			role: 'cut'
		},
		{
			label: 'Copy',
			accelerator: 'CmdOrCtrl+C',
			role: 'copy'
		},
		{
			label: 'Paste',
			accelerator: 'CmdOrCtrl+V',
			role: 'paste'
		},
		{
			type: 'separator'
		},
		{
			label: 'Preferences ...',
			accelerator: 'CmdOrCtrl+,',
			click: function() {
				sendAction('preferences');
			}
		},
		{
			label: 'User Profile ...',
			accelerator: 'CmdOrCtrl+Alt+,',
			click: function() {
				sendAction('profile');
			}
		}
	]
},
{
	label: 'View',
	submenu: [
		{
			label: 'Projects',
			accelerator: 'CmdOrCtrl+1',
			click: function() {
				sendAction('goto-projects');
			}
		},
		{
			label: 'My Work',
			accelerator: 'CmdOrCtrl+2',
			click: function() {
				sendAction('goto-my-work');
			}
		},
		{
			label: 'Activity',
			accelerator: 'CmdOrCtrl+3',
			click: function() {
				sendAction('goto-activity');
			}
		},
		{
			label: 'Calendar',
			accelerator: 'CmdOrCtrl+4',
			click: function() {
				sendAction('goto-calendar');
			}
		},
		{
			label: 'People',
			accelerator: 'CmdOrCtrl+5',
			click: function() {
				sendAction('goto-people');
			}
		},
		{
			label: 'Invoices',
			accelerator: 'CmdOrCtrl+6',
			click: function() {
				sendAction('goto-invoices');
			}
		},
		{
			label: 'Estimates',
			accelerator: 'CmdOrCtrl+7',
			click: function() {
				sendAction('goto-estimates');
			}
		},
		{
			type: 'separator'
		},
		{
			label: 'Reports',
			accelerator: 'CmdOrCtrl+8',
			click: function() {
				sendAction('goto-reports');
			}
		},
		{
			label: 'Trash',
			accelerator: 'CmdOrCtrl+9',
			click: function() {
				sendAction('goto-trash');
			}
		},
		{
			type: 'separator'
		},
		{
			label: 'Completed Projects',
			accelerator: 'CmdOrCtrl+0',
			click: function() {
				sendAction('goto-completed-projects');
			}
		},
		{
			type: 'separator'
		},
		{
			label: 'Reload',
			accelerator: 'CmdOrCtrl+R',
			click: function() {
				const win = BrowserWindow.getAllWindows()[0];
				win.webContents.reload();
			}
		}
	]
},
{
	label: 'Help',
	role: 'help'
}];

// Help submenu
const helpSubmenu = [
{
	label: `${appName} Website …`,
	click: function() {
		shell.openExternal('https://github.com/nurtext/ActiveCollabDesktop');
	}
},
{
	label: 'Report an Issue …',
	click: function() {
		const body = `
**Please succinctly describe your issue and steps to reproduce it.**

-

${app.getName()} ${app.getVersion()}
${process.platform} ${process.arch} ${os.release()}`;

		shell.openExternal(`https://github.com/nurtext/ActiveCollabDesktop/issues/new?body=${encodeURIComponent(body)}`);
	}
},
{
	type: 'separator'
},
{
	label: 'Download Active Collab Timer …',
	click: function() {
		shell.openExternal('https://www.activecollab.com/timer.html');
	}
}];

// Distinguish between Mac OS X and Linux/Windows
if (process.platform == 'darwin')
{
	tpl = darwinTpl;

}
else
{
	tpl = linuxTpl;

}

// Add help submenu to template
tpl[tpl.length - 1].submenu = helpSubmenu;

// Export finished/built template
module.exports = electron.Menu.buildFromTemplate(tpl);
