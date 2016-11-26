define([
	'text!environment'
], function(environment){

	'use strict';

	const path = require('path'),
		EventEmitter = require('events')
	;

	environment = environment.trim();

	if(environment === 'DEVEL'){
		var ipcRenderer = require('electron').ipcRenderer;
		console.log('DEVEL MODE ON!');
		ipcRenderer.send('devMode', true);
		require('electron').remote.getCurrentWindow().webContents.openDevTools()
	}

	class Env extends EventEmitter {
		constructor() {
			super();
			this._data = {};
		}
		isDebug() {
			return (environment === 'DEVEL');
		}
		getcwd() {
			var cwd;
			if(environment === 'DEVEL'){
				cwd = path.resolve('./..');
			} else {
				cwd = path.dirname(process.execPath);
			}
			return cwd;
		}

		set(key, val) {
			this._data[key] = val;
			return this;
		}

		get(key) {
			return this._data[key];
		}
	}


	return new Env();

});