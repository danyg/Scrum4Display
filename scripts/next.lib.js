'use strict';

var fs = require('fs'),
	path = require('path')
;

function Version(v) {
	var tmp = v.split('.');
	this._major = parseInt(tmp[0], 10);
	this._minor = parseInt(tmp[1], 10);
	this._build = parseInt(tmp[2], 10);
}

Version.prototype.incrementMajor = function() {
	this._major++;
};

Version.prototype.incrementMinor = function() {
	this._minor++;
};

Version.prototype.incrementBuild = function() {
	this._build++;
};

Version.prototype.compareTo = function(version) {
	var hashMe =this._major * 10000000000 +
				this._minor * 100000 +
				this._build
	;
	var hashTh =version._major * 10000000000 +
				version._minor * 100000 +
				version._build
	;

	return hashMe - hashTh;
};

Version.prototype.toString = function() {
	return ([this._major, this._minor, this._build]).join('.');
};

function ConfigFile(file) {
	this._file = path.resolve(file);
	this._content = null;
	this._JSONcontent = null;
	this._version = null;

	this._readContent();
	this._readVersion();
}

ConfigFile.prototype._readContent = function() {
	try {
		this._content = fs.readFileSync(this._file);
	} catch( e ) {
		console.error('can\'t read ', this._file, e.message);
	}
	this._JSONcontent = JSON.parse(this._content);
};

ConfigFile.prototype._readVersion = function() {
	this._version = new Version(this._JSONcontent.version);
};

ConfigFile.prototype.getContent = function() {
	return this._content;
};

ConfigFile.prototype.getVersion = function() {
	return this._version;
};

ConfigFile.prototype.setVersion = function(version) {
	this._version = version;
};

ConfigFile.prototype.write = function() {
	this._JSONcontent.version = this._version.toString();
	try{
		fs.writeFileSync(
			this._file,
			JSON.stringify(this._JSONcontent, undefined, '\t'),
			{
				'encoding': 'utf8'
			}
		);
		return true;
	} catch( e ) {
		console.warn('Error trying to write on ', this._file, e.message);
		return false;
	}
};

function doIt(argv) {
	if(argv === undefined) {
		argv = process.argv;
	}

	var versionFiles = [
		'./package.json',
		'./app/package.json',
		'./app/bower.json'
	],
		versionConfigs = [],
		currentVersion
	;

	versionFiles.forEach(function(file) {
		versionConfigs.push(
			new ConfigFile(file)
		);
	});

	currentVersion = versionConfigs[0].getVersion();

	versionConfigs.forEach(function(config) {
		var other = config.getVersion(),
			cmp = currentVersion.compareTo(other)
		;
		currentVersion = cmp < 0 ? other : currentVersion;
	});

	argv = argv.map(function(i){
		return i.toLowerCase();
	});

	if(argv.indexOf('--version') !== -1) {
		var i = argv.indexOf('--version');
		var v = argv[i+1];
		currentVersion = new Version(v);
	}
	else if(argv.indexOf('--major') !== -1) {
		currentVersion.incrementMajor();
	} else if(argv.indexOf('--minor') !== -1) {
		currentVersion.incrementMinor();
	} else {
		currentVersion.incrementBuild();
	}

	versionConfigs.forEach(function(config) {
		config.setVersion(currentVersion);
		config.write();
	});

	console.log('Version setted to ' + currentVersion.toString() + '\n');
}

module.exports = doIt;