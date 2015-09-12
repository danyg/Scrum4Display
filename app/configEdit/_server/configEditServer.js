'use strict';

var express = require('express'),
	bodyParser = require('body-parser'),
	// cookieParser = require('cookie-parser'),
	fs = require('fs'),
	path = require('path'),
	app = express()
;

var securityController = {
	incomingFilter: function(req, res, next) {
		console.log('--> [%s] %s', req.method, req.originalUrl);
		next();
	},
	outgoingFilter: function(req, res, next) {
		console.log('<-- [%s]', res.statusCode);
		next();
	}
};

var configController = {
	configFilePath: '',

	get: function(req, res, next) {
		fs.readFile(configController.configFilePath, function(err, data) {
			if(!!err) {
				res.status(500).end();
			} else {
				res.send(data);
			}

			next();
		});
	},
	save: function(req, res, next) {
		fs.writeFile(configController.configFilePath, req.body, function(err) {
			if(!!err) {
				res.status(500).end();
			} else {
				res.status(201).end();
			}

			next();
		});
	},
	redirectEditor: function(req, res) {
		res.redirect(301, '/configEdit/editor.html');
	}
};

function start(rootPath, configFilePath){

	configController.configFilePath = configFilePath;

	var config = JSON.parse(fs.readFileSync(configFilePath));
	var PORT = 9001;

	if (!!config.serverEditor) {
		if(!!config.serverEditor.port) {
			PORT = config.serverEditor.port;
		}
	}

	var server = app
		.use(bodyParser.text())
		// .use(cookieParser())

		.all('*', securityController.incomingFilter)
		.get('/', configController.redirectEditor)
		.get('/config.json', configController.get)
		.put('/config.json', configController.save)

		.all('*', securityController.outgoingFilter)
		.use(express.static(rootPath))

		.listen(PORT, function () {
			var host = server.address().address;
			var port = server.address().port;

			console.log('ConfigEditServer listening at http://%s:%s', host, port);
			console.log('Statics %s', rootPath);
		})
	;
}

if (!module.parent) {
	var tmp, tmp1;
	tmp = process.argv.indexOf('--root-path');
	tmp1 = process.argv.indexOf('--config-path');
	if(tmp === -1 || tmp1 === -1) {
		console.log('You shall specify --root-path and --config-path like --root-path /path/to/file --config-path /path/to/config.json');
		process.exit();
	}

	var rootPath = path.resolve( process.argv[tmp+1] ),
		configFilePath = path.resolve( process.argv[tmp1+1] )
	;

	if(!fs.existsSync(rootPath) || !fs.existsSync(configFilePath)){
		console.log('rootPath: [%s] %s\nconfigPath: [%s] %s',
			fs.existsSync(rootPath) ? 'EXISTS' : 'DOESN\'T EXISTS',
			rootPath,
			fs.existsSync(configFilePath) ? 'EXISTS' : 'DOESN\'T EXISTS',
			configFilePath
		);
		process.exit();
	}

    start(rootPath, configFilePath);
} else {
}

module.exports = start;
