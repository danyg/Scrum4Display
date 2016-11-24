/**
* @Overview
*
* @Author: Daniel Goberitz
* @Date:               2016-11-05 10:43:46
* @Last Modified time: 2016-11-23 06:56:11
*/

'use strict';

const electron = require('electron');

const app = electron.app;

// require('electron-debug')();

let mainWindow;

function onClosed() {
	mainWindow = null;
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 1024,
		height: 600,

		title: 'Scrum Display',
		frame: true,
		toolbar: false,
		// resizable: false,
		// fullscreen: true
	});
	win.setMenu(null);

	win.loadURL(`file://${__dirname}/index.html`);
	win.on('closed', onClosed);

	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();
});