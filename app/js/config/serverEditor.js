define([
	'env',
	'mousetrap'
], function(
	env,
	Mousetrap
){

	'use strict';

	var currentConfig,
		child_process = require('child_process'),
		path = require('path'),
		assetsPath,
		configFilePath,
		serverProcess,
		Win = require('nw.gui').Window,
		PORT,
		editorWindow
	;

	function serverEditor(config) {
		assetsPath = env.get('assetsPath');
		configFilePath = env.get('configFilePath');

		if(!!config && config.disabled === true) {
			return;
		}
		PORT = config.port || 9001;

		serverEditor._startServer();
		currentConfig = JSON.parse(JSON.stringify(config));
	}

	serverEditor.onRefreshConfig = function(config){
		if( (!!currentConfig && currentConfig.port !== config.port) || (!!config && !!config.disabled) ) {
			serverEditor._stopServer();
		}
		serverEditor(config);
	};

	serverEditor.openEditor = function() {
		if(!editorWindow) {
			if(!!serverProcess) {
				editorWindow = Win.open('http://localhost:' + PORT + '/configEdit/editor.html', {
					title: 'Config Editor',
					toolbar: false,
					position: 'mouse',
					resizable: true,
					'always-on-top': true,
					'show_in_taskbar': false,
					'plugin': false,
					'java': false,

					focus: true
				});
				editorWindow.on('closed', function() {
					editorWindow = null;
				});
			}
		} else {
			editorWindow.focus();
		}
	};

	serverEditor._startServer = function() {
		if(!serverProcess) {
			serverProcess = child_process.fork(
				path.normalize(assetsPath + '/configEdit/_server/configEditServer.js'),
				[
					'--root-path', assetsPath,
					'--config-path', configFilePath
				],
				{
					silent: true
				}
			);
			console.log('Server Started');
		}
	};

	serverEditor._stopServer = function() {
		if(!!serverProcess) {
			serverProcess.kill();
			serverProcess = null;
			if(!!editorWindow) {
				editorWindow.close();
			}
		}
	};

	process.on('exit', function() {
		serverEditor._stopServer();
	});

	Mousetrap.bind('f12', function() {
		serverEditor.openEditor();
	});

	return serverEditor;
});