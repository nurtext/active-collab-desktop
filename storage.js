'use strict';

// Require Electron modules
const app          = require('electron').app;

// Require Node modules
const fs           = require('fs');
const path         = require('path');

// Set path for settings file
const dataFilePath = path.join(app.getPath('userData'), 'settings.json');

// Read data from storage
function readData()
{
	try
	{
		return JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

	}
	catch (err)
	{
		return {};

	}

}

// Write data to storage
exports.set = (key, val) =>
{
	const data = readData();
	data[key] = val;
	fs.writeFileSync(dataFilePath, JSON.stringify(data));

};

exports.get = key => readData()[key];
