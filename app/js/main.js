(function(){
	'use strict';

	var fs = require('fs'),
		path = require('path'),
		environment,
		b = '../bower_components',
		remote = require('electron').remote,
		ASSET_PATH = remote.app.getAppPath(),
		BASE = path.resolve(ASSET_PATH + '/js').replace(/\\/g, '/')
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


	requirejs([
		'jquery',
		'env'
	], function(
		$,
		env
	){

		'use strict';

		env.set('assetsPath', ASSET_PATH);

		window.jQuery = window.$ = window._$ = $;

		requirejs(['ui', 'bootstrap',], function(ui, bootstrap){

		});

	});

}());

