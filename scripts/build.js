var NwBuilder = require('nw-builder');
var nextV = require('./next.lib.js');

var nw = new NwBuilder({
	 files: ['app/**/**', 'release-definitions/**/**'], // use the glob format
	 buildDir: 'build',
	 cacheDir: 'cache',
	 platforms: ['win32'],
	 version: '0.12.3'
});

//Log stuff you want

nw.on('log', console.log);

// Build returns a promise
nw.build().then(function () {
	nextV();
	console.log('all done!');
}).catch(function (error) {
	 console.error(error);
});
