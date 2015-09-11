(function(){
	'use strict';

	var path = require('path'),
		fs = require('fs'),
		configModulesFiles,
		configModulesIds,
		configModulesRequireList
	;

	configModulesFiles = fs.readdirSync(path.resolve('./js/config/'));
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

			var keys = Object.keys(config),
				key,
				i
			;
			for(i = 0; i < keys.length; i++){
				key = keys[i];

				if(configStrategy.hasOwnProperty(key)){
					try{

						if(configApplied === 0 || typeof configStrategy[key].onRefreshConfig !== 'function'){
							configStrategy[key](config[key]);
						} else {
							configStrategy[key].onRefreshConfig(config[key]);
						}

					} catch(e){
						console.error('Error applying config for ', key, config[key], e.message, e.stack);
					}
				} else {
					console.warn('No Config Strategy for', key);
				}
			}
			configApplied++;
		}

		return applyConfig;
	});

}());