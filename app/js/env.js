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
		}
	}


});