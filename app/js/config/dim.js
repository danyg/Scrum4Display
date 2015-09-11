define([
	'jquery'
], function(
	$
){

	'use strict';
	var currentConfig;

	function dim(config) {
		currentConfig = config.toLowerCase();
		$('body').addClass('dim-' + currentConfig);
	}

	dim.onRefreshConfig = function(config){
		$('body').removeClass('dim-' + currentConfig);
		dim(config);
	};

	return dim;
});