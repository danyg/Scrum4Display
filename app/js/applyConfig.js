(function(){
	'use strict';

	var path = require('path'),
		fs = require('fs'),
		configModulesFiles,
		configModulesIds,
		configModulesRequireList,
		remote = require('electron').remote,
		BASE = path.resolve(remote.app.getAppPath() + '/js').replace(/\\/g, '/')
	;

	configModulesFiles = fs.readdirSync(path.resolve(BASE + '/config/'));
	configModulesIds = configModulesFiles.map(function(file){
		return path.basename(file, '.js');
	});
	configModulesRequireList = configModulesIds.map(function(moduleId){
		return 'config/' + moduleId;
	});

	define(
		configModulesRequireList,
		function()
	{
		var configStrategy = {},
			configApplied = 0
		;

		for(var i = 0, moduleId; i < configModulesIds.length; i++){
			moduleId = configModulesIds[i];
			configStrategy[moduleId] = arguments[i];
		}

		function applyConfig(config){
			var configStrategies = Object.keys(configStrategy);
			configStrategies.forEach(function(strategyName) {
				applyStrategy(strategyName, config);
			});

			configApplied++;
		}

		function applyStrategy(strategyName, config) {
			var strategyConfig = null;
			if(config.hasOwnProperty(strategyName)) {
				strategyConfig = config[strategyName];
			}

			try {
				if(configApplied === 0 || typeof configStrategy[strategyName].onRefreshConfig !== 'function'){
					configStrategy[strategyName](strategyConfig, config);
				} else {
					configStrategy[strategyName].onRefreshConfig(strategyConfig, config);
				}
			} catch( e ) {
				console.error('Error applying config for ', strategyName, strategyConfig, e.message, e.stack);
				// error on ui
			}
		}

		return applyConfig;
	});

}());