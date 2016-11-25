define([
	'text!environment'
], function(environment){

	'use strict';

	var path = require('path');

	environment = environment.trim();

	if(environment === 'DEVEL'){
		var ipcRenderer = require('electron').ipcRenderer;
		console.log('DEVEL MODE ON!');
		ipcRenderer.send('devMode', true);
		require('electron').remote.getCurrentWindow().webContents.openDevTools()
	}

	return {
		_data: {},

		isDebug: function(){
			return (environment === 'DEVEL');
		},

		getcwd: function(){
			var cwd;
			if(environment === 'DEVEL'){
				cwd = path.resolve('./..');
			} else {
				cwd = path.dirname(process.execPath);
			}
			return cwd;
		},

		set: function(key, val) {
			this._data[key] = val;
			return this;
		},
		get: function(key) {
			return this._data[key];
		}
	};

});