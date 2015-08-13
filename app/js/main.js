!(function(){

	'use strict';

	var fs = require('fs'),
		path = require('path'),
		cwd = path.dirname(process.execPath)
	;

	function loadConfiguration(){
		var configFilePath = path.normalize(cwd + '/config.json');
		if(fs.existsSync(configFilePath)){
			//try{
				var config = JSON.parse(fs.readFileSync(configFilePath));
				for(var i=0; i < config.length; i++){
					new Web(config[i]);
				}
				// new Web($('.top-left'), config[0]);
				// new Web($('.top-right'), config[1]);
				// new Web($('.bottom-left'), config[2]);
				// new Web($('.bottom-right'), config[3]);
			//} catch(e) {
			//	alert('Error reading ' + configFilePath + ' ' + e.message);
			//	console.error(e);
			//}
			
		} else {
			alert('Config file doesn\'t exists ' + configFilePath);
		}
		
	}

	function Web(config){
		this.$iframe = $('<iframe nwfaketop class="top-left" src="app://scrum4display/notfound.html"/>').appendTo('body');
		this.config = config;
		this.setUrl(this.config.url);
		this.setConfig();
	}

	Web.prototype.setUrl = function(url){
		if(url.indexOf('~') !== -1){
			var local = 'file://' + cwd.indexOf('\\') !== -1 ? '/' + cwd.replace(/\\/g,'/') : cwd;
			url = url.replace('~', local);
		}
		this.$iframe.attr('src', url);
		this.listenForLoad();
		
	};

	Web.prototype.setConfig = function(){
		this._refreshInterval();
		if(!!this.config.type){
			this.$iframe.addClass(this.config.type);
		}
		if(!!this.config.top) {
			this.$iframe.css('top', this.config.top);
		}
		if(!!this.config.left) {
			this.$iframe.css('left', this.config.left);
		}
		if(!!this.config.width) {
			this.$iframe.css('width', this.config.width);
		}
		if(!!this.config.height) {
			this.$iframe.css('height', this.config.height);
		}
	};

	Web.prototype.listenForLoad = function(){
		$(this.$iframe)
			.bind('load', this._onload.bind(this))
		;
	};

	Web.prototype._onload = function(){
		console.log(this.$iframe[0].contentDocument.location.toString(), 'Loaded');
		this._injectStyles();
		this._injectScripts();
	};

	Web.prototype._injectStyles = function(){
		if(!!this.config.styles){
			var $styles = $('<style type="text/css">' + this.config.styles + '</style>');
			$('head', this.$iframe[0].contentDocument).append($styles);
		}
	};

	Web.prototype._injectScripts = function(){
		if(!!this.config.scripts){
			var $iframe = this.$iframe,
				scripts = this.config.scripts,
				doc = $iframe[0].contentDocument,
				win = $iframe[0].contentWindow
			;

			$.get('app://scrum4display/js/jquery-2.1.4.min.js').done(function(jqjs){
				console.log("Injecting jQuery in", win.location.toString());
				var script = '';
				script += '!(function(){';
				script += '\n' + jqjs;
				script += '\njQuery.noConflict();';
				script += '\nvar $ = jQuery;'
				script += '\ntry{\n' + scripts + '\n}catch(_E){ console.error(_E); }';
				script += 'console.log("script injected in", location.toString());';
				script += '\n}());';

				var s = doc.createElement('script');
				s.type = 'text/javascript';
				s.innerHTML = script;
				doc.head.appendChild(s);
			});
		}
	};

	Web.prototype._refreshInterval = function(){
		if(!!this.config.refresh){
			var time = this.config.refresh * 60000;
			this._refreshTimer = setInterval(this._refresh.bind(this), time);
		}
	};

	Web.prototype._refresh = function(){
		this.$iframe[0].contentWindow.location.reload();
	};

	$(document).ready(function() {
		loadConfiguration();
	});
}());