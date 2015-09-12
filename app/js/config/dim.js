define([
	'jquery'
], function(
	$
){

	'use strict';
	var currentConfig;

	function dim(config) {
		if(config === null) {
			return;
		}
		currentConfig = config.toLowerCase();
		$('#container').addClass('dim-' + currentConfig);
	}

	dim.onRefreshConfig = function(config){
		$('#container').removeClass('dim-' + currentConfig);
		dim(config);
	};

	return dim;
});