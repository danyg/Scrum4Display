define([
	'Web'
], function(
	Web
){

	'use strict';

	var openedWebs = [];

	function webs(config) {
		for(var i=0; i < config.length; i++){
			openedWebs.push(
				new Web(config[i])
			);
		}
	}

	webs.onRefreshConfig = function(config){
		//TODO check if only changes url!
		openedWebs.forEach(function(web){
			web.remove();
		});

		openedWebs = [];

		webs(config);
	};

	return webs;
});