define([
	'jquery'
], function(
	$
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
		}
	}

	hackScript.onRefreshConfig = function(config){
		return hackScript(config);
	};

	return hackScript;
});