define([
	'text!environment'
], function(environment){

	'use strict';

	var path = require('path');

	if(environment === 'DEVEL'){
		var gui = require('nw.gui');
		gui.Window.get().showDevTools();
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