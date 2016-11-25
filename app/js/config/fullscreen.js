/*
* @Author: Daniel Goberitz
* @Date:   2016-11-25 20:04:30
* @Last Modified by:   danyg
* @Last Modified time: 2016-11-25 20:07:19
*/
define([], () => {

	'use strict';
	var currentConfig;

	const remote = require('electron').remote,
		win = remote.getCurrentWindow()
	;

	function fullscreen(config) {
		fullscreen.onRefreshConfig(config);
	}

	fullscreen.onRefreshConfig = function(config){
		if(config === null) {
			config = true;
		}
		config = !!config;

		win.setFullScreen(config);
	};

	return fullscreen;
});