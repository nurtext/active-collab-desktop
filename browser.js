'use strict';

const ipc = require('electron').ipcRenderer;

// Trigger for "Settings"
ipc.on('preferences', function()
{
	document.querySelector('a[ng-href="settings"], a[href="settings"]').click();

});

// Trigger for "Profile"
ipc.on('profile', function()
{
	document.querySelector('a[ng-href="profile"], a[href="profile"]').click();

});

// Trigger for "Logout"
ipc.on('logout', function()
{
	document.querySelector('a[ng-href="logout"], a[href="logout"]').click();

});

// Trigger for "New Project"
ipc.on('new-project', function()
{
	document.querySelector('a[ng-href="projects"], a[href="projects"]').click();
	document.querySelector('a[ng-href="projects/add"], a[href="projects/add"]').click();

});

// Trigger for "Find"
ipc.on('find', function()
{
	if (document.querySelector('input[ng-model="search.query"]'))
	{
		document.querySelector('input[ng-model="search.query"]').focus();

	}
	else
	{
		document.querySelector('button#search_button').click();

	}

});

// Trigger for "Projects"
ipc.on('goto-projects', function()
{
	document.querySelector('a[ng-href="projects"], a[href="projects"]').click();

});

// Trigger for "My Work"
ipc.on('goto-my-work', function()
{
	document.querySelector('a[ng-href="my-work"], a[href="my-work"]').click();

});

// Trigger for "Activity"
ipc.on('goto-activity', function()
{
	document.querySelector('a[ng-href="activity"], a[href="activity"]').click();

});

// Trigger for "Calendar"
ipc.on('goto-calendar', function()
{
	document.querySelector('a[ng-href="calendar"], a[href="calendar"]').click();

});

// Trigger for "People"
ipc.on('goto-people', function()
{
	document.querySelector('a[ng-href="people"], a[href="people"]').click();

});

// Trigger for "Invoices"
ipc.on('goto-invoices', function()
{
	document.querySelector('a[ng-href="invoices"], a[href="invoices"]').click();

});

// Trigger for "Estimates"
ipc.on('goto-estimates', function()
{
	document.querySelector('a[ng-href="estimates"], a[href="estimates"]').click();

});

// Trigger for "Reports"
ipc.on('goto-reports', function()
{
	document.querySelector('a[ng-href="reports"], a[href="reports"]').click();

});

// Trigger for "Trash"
ipc.on('goto-trash', function()
{
	document.querySelector('a[ng-href="trash"], a[href="trash"]').click();

});

// Trigger for "Completed Projects"
ipc.on('goto-completed-projects', function()
{
	document.querySelector('a[ng-href="projects"], a[href="projects"]').click();
	document.querySelector('a[ng-href="projects/archive"], a[href="projects/archive"]').click();

});
