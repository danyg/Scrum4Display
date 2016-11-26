define([
	'jquery',
	'env',
	'utils'
], function(
	$,
	env,

	utils
){

	'use strict';
	var currentConfig;

	function includeScript(src) {
		console.log('Adding Hack script', src);
		var s = document.createElement('script');
		s.type = 'text/javascript';
		s.src = src;
		document.head.appendChild(s);
	};

	function hackScript(config) {
		if(!!config && !!config.length) {
			config.forEach((script) => {
				includeScript(script);
			});
			currentConfig = config;
		}
	}

	hackScript.onRefreshConfig = function(config){
		var result = utils.compareConfigArray(currentConfig, config);

		if(result === false) {
			env.emit('ui', 'reloadAndClearCache');
		} else if(!!result && result.length > 0) {
			// we add the new scripts
			result.forEach((script) => {
				includeScript(script);
			});
			currentConfig = config;
		}
	};

	return hackScript;
});