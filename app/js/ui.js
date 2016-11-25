/*
* @Author: Daniel Goberitz
* @Date:   2016-11-25 19:14:48
* @Last Modified by:   danyg
* @Last Modified time: 2016-11-25 21:40:45
*/
/*globals hideModal: true */
define([
	'env',
	'mousetrap',
	'applyConfig',

	'modals'
], (
	env,
	mousetrap,
	applyConfig
) => {

	'use strict';

	const remote = require('electron').remote,
		win = remote.getCurrentWindow(),
		ses = win.webContents.session,

		path = require('path'),
		fs = require('fs'),

		cwd = env.getcwd(),
		configFilePath = path.normalize(cwd + '/config.json'),
		assetsPath = path.resolve('./')
	;

	env.set('configFilePath', configFilePath);
	env.set('assetsPath', assetsPath);

	class UI {
		constructor() {

			mousetrap.bind('f5', () => {
				this.reload();
			});

			mousetrap.bind('ctrl+f5', () => {
				this.reloadAndClearCache();
			});

			mousetrap.bind('f11', () => {
				this.toggleFullscreen();
			});

			mousetrap.bind('ctrl+shift+i', () => {
				this.openDevTools();
			});

			fs.watchFile(configFilePath, () => {
				this.loadConfiguration();
			});


			$(document).ready(() => {
				$('.start-hide').modal('hide');
				this.loadConfiguration();
			});

		}

		loadConfiguration() {

			if(fs.existsSync(configFilePath)) {
				try {
					hideModal();
					var config = JSON.parse(fs.readFileSync(configFilePath));
					applyConfig(config);
				} catch (e) {
					alert(e.message + '.\n\nAfter fix it, press F5 key to reload the config file.', 'Oops... something went wrong with the config file!');
				}
			} else {
				alert('Looking for file: ' + configFilePath + '. You can create it and press F5 key to load it.', 'Config file doesn\'t exists!');
			}
		}

		toggleFullscreen() {
			win.setFullScreen(!win.isFullScreen());
		}

		openDevTools() {
			win.toggleDevTools();
		}

		reload() {
			this.loadConfiguration();
		}

		reloadAndClearCache() {
			ses.clearCache(() => {
				window.location.reload();
			});
		}

	}

	return new UI();
});