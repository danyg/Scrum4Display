(function(){
	'use strict';

	var fs = require('fs'),
		path = require('path'),
		environment,
		b = '../bower_components',
		remote = require('electron').remote,
		BASE = path.resolve(remote.app.getAppPath() + '/js').replace(/\\/g, '/')
	;

	environment = '../environment';

	requirejs.config({
		// baseUrl: 'app://scrum4display/js/',
		baseUrl: BASE,
		paths: {
			jquery: b + '/jquery/dist/jquery.min',
			'jquery.js': b + '/jquery/dist/jquery.min.js',
			// bootstrap: b + '/bootstrap/dist/js/bootstrap.min',
			bootstrap: b + '/bootstrap/dist/js/bootstrap',
			mousetrap: b + '/mousetrap/mousetrap',
			text: b + '/requirejs-text/text',
			'environment': environment
		},
		shim: {
			'bootstrap': {
				deps: ['jquery']
			}
		}
	});
}());

define([
	'jquery'
], function(
	$
){

	'use strict';

	window.jQuery = window.$ = window._$ = $;

	requirejs(['ui', 'bootstrap',], function(ui, bootstrap){

	});

});