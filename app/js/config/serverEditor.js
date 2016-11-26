define([
	'env',
	'mousetrap'
], function(
	env,
	mousetrap
){

	'use strict';


	var currentConfig,
		currentVersion = require('electron').remote.app.getVersion(),
		child_process = require('child_process'),
		path = require('path'),
		assetsPath,
		configFilePath,
		serverProcess,
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

				const {BrowserWindow} = require('electron').remote
				editorWindow = new BrowserWindow({
					title: 'Config Editor',
					toolbar: false,
					position: 'mouse',
					resizable: true,
					'always-on-top': true,
					'show_in_taskbar': false,
					'plugin': false,
					'java': false,

					focus: true,
					webPreferences: {
						nodeIntegration: false
					}
				});
				editorWindow.setMenu(null);
				console.log('OPENING: http://localhost:5580/configEdit/editor.html')
				editorWindow.loadURL('http://localhost:' + PORT + '/configEdit/editor.html');

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
					'--config-path', configFilePath,
					'--version', currentVersion
				],
				{
					silent: true
				}
			);

			serverProcess.on('message', (msg) => {
				console.log('Message Received from config Server', msg);
				env.emit('configedit', msg);
			});

			console.log('Server Started');

			window.serverProcess = serverProcess;
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

	window.addEventListener('unload', function(event) {
		serverEditor._stopServer();
	});

	mousetrap.bind('f12', function() {
		serverEditor.openEditor();
	});

	return serverEditor;
});