(function(){
	'use strict';

	var fs = require('fs'),
		path = require('path'),
		environment,
		b = '../bower_components'
	;

	environment = fs.existsSync(path.resolve('./release-definitions/environment')) ?
		'../release-definitions/environment' :
		'../environment'
	;

	requirejs.config({
		baseUrl: 'app://scrum4display/js/',
		paths: {
			jquery: b + '/jquery/dist/jquery.min',
			'jquery.js': b + '/jquery/dist/jquery.min.js',
			bootstrap: b + '/bootstrap/dist/js/bootstrap.min',
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
	'env',
	'jquery',
	'bootstrap',

	'applyConfig',
	'mousetrap',
	'modals'
], function(
	env,
	$,
	bootstrap,

	applyConfig,
	Mousetrap
){

	'use strict';

	var fs = require('fs'),
		path = require('path'),
		gui = require('nw.gui')
	;

	function loadConfiguration(){
		var cwd = env.getcwd(),
			configFilePath = path.normalize(cwd + '/config.json')
		;

		if(fs.existsSync(configFilePath)){
			var config = JSON.parse(fs.readFileSync(configFilePath));
			applyConfig(config);
		} else {
			var p = alert('Config file doesn\'t exists ' + configFilePath);
			if(!!p){
				p.done(function() {
					process.exit();
				});
			} else {
				process.exit();
			}
		}

	}

	Mousetrap.bind('f5', function() {
		loadConfiguration();
	});

	Mousetrap.bind('shift+f5', function() {
		gui.Window.get().reloadDev();
	});

	$(document).ready(function() {
		$('.start-hide').modal('hide');
		loadConfiguration();
	});

});