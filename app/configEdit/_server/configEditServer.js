'use strict';

var express = require('express'),
	bodyParser = require('body-parser'),
	fs = require('fs'),
	path = require('path'),
	app = express()
;

var root = path.resolve(process.cwd + '/../..'),
	configFilePath = path.resolve(root + '/../config.json')
;

var configController = {
	get: function(req, res) {
		fs.readFile(configFilePath, function(err, data) {
			if(!!err) {
				res.status(500).end();
			} else {
				res.send(data);
			}
		});
	},
	save: function(req, res) {
		fs.writeFile(configFilePath, req.body, function(err) {
			if(!!err) {
				res.status(500).end();
			} else {
				res.status(201).end();
			}
		});
	}
};

var server = app
	.use(express.static(root))
	.use(bodyParser.text())
	.get('/config.json', configController.get)
	.put('/config.json', configController.save)
	.listen(9001, function () {
		var host = server.address().address;
		var port = server.address().port;

		console.log('ConfigEditServer listening at http://%s:%s', host, port);
		console.log('Statics %s', root);
	})
;
