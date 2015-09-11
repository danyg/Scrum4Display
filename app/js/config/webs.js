define([
	'Web'
], function(
	Web
){

	'use strict';

	var openedWebs = [];

	function getConfig(config, generalConfig) {
		if(typeof config === 'string') {
			if(generalConfig.hasOwnProperty(config)) {
				return generalConfig[config];
			} else {
				alert('The Key ' + config + 'wasn\'t found in the config file');
			}
		} else {
			return config;
		}
	}

	function webs(config, generalConfig) {
		var realConfig = getConfig(config, generalConfig);
		for(var i=0; i < realConfig.length; i++){
			openedWebs.push(
				new Web(realConfig[i])
			);
		}
	}

	webs.onRefreshConfig = function(config, generalConfig){
		//TODO check if only changes url!
		openedWebs.forEach(function(web){
			web.remove();
		});

		openedWebs = [];

		webs(config, generalConfig);
	};

	return webs;
});