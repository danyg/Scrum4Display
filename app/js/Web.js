define([
	'jquery',
	'text!jquery.js',
	'env',
	'IframeMousetrap'
], function(
	$,
	jquerySrc,
	env,
	IframeMousetrap
){
	'use strict';

	var cwd = env.getcwd();

	var gui = require('nw.gui'),
		contextMenu = new gui.Menu(),
		focusedWeb
	;

	function onContextMenu(event, web){
		focusedWeb = web;
		var pos = web.getPosition();
		pos.left += event.pageX;
		pos.top += event.pageY;

		contextMenu.popup(pos.left, pos.top);
	}

	function Web(config){
		this.$iframe = $('<iframe nwfaketop src="app://scrum4display/notfound.html"/>').appendTo('body');
		this.iframe = this.$iframe.get(0);
		this.config = config;
		this._opacity = 1;

		this.listenForLoad();

		this.$iframe.data('web', this);

		this.goHome();
		this._setConfig();
	}

	Web.goHome = function(){
		if(!!focusedWeb){
			focusedWeb.goHome();
		}
	};

	Web.refresh = function(){
		if(!!focusedWeb){
			focusedWeb.refresh();
		}
	};

	contextMenu.append(new gui.MenuItem({
		label: 'Home',
		click: Web.goHome
	}));
	contextMenu.append(new gui.MenuItem({
		label: 'Reload',
		click: Web.refresh
	}));

	Web.prototype.goHome = function(){
		this.setUrl(this.config.url);
	};

	Web.prototype.setUrl = function(url){
		this._clean();
		if(url.indexOf('~') !== -1){
			var local = 'file://' + cwd.indexOf('\\') !== -1 ? '/' + cwd.replace(/\\/g,'/') : cwd;
			url = url.replace('~', local);
		}
		this.$iframe.attr('src', url);
	};

	Web.prototype._setConfig = function(){
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
		if(!!this.config.bottom) {
			this.$iframe.css('bottom', this.config.bottom);
		}
		if(!!this.config.right) {
			this.$iframe.css('right', this.config.right);
		}
		if(!!this.config.width) {
			this.$iframe.css('width', this.config.width);
		}
		if(!!this.config.height) {
			this.$iframe.css('height', this.config.height);
		}
		if(!!this.config.zIndex) {
			this.$iframe.css('zIndex', this.config.zIndex);
		}
		if(!!this.config.opacity) {
			this.$iframe.css('opacity', this.config.opacity);
			this._opacity = this.config.opacity;
		}
	};

	Web.prototype._setEvents = function(){
		this.listenForContextMenu();
	};

	Web.prototype.listenForLoad = function(){
		$(this.$iframe)
			.on('load.web', this._onload.bind(this))
		;
	};

	Web.prototype.listenForContextMenu = function(){
		var me = this;
		$(this.iframe.contentWindow).on('contextmenu.web', function(e){
			onContextMenu(e, me);
		});
	}

	Web.prototype._onload = function(){

		this._mouseTrapInstance = new IframeMousetrap(this.iframe.contentDocument);


		this._setEvents();
		console.log(this.iframe.contentDocument.location.toString(), 'Loaded');
		this._injectStyles();
		this._injectScripts();
		this.$iframe.css('opacity', this._opacity);
	};

	Web.prototype._injectStyles = function(){
		if(!!this.config.styles){
			var $styles = $('<style type="text/css">' + this.config.styles + '</style>');
			$('head', this.iframe.contentDocument).append($styles);
		}
	};

	Web.prototype._injectScripts = function(){
		if(!!this.config.scripts){
			var $iframe = this.$iframe,
				scripts = this.config.scripts,
				doc = this.iframe.contentDocument,
				win = this.iframe.contentWindow
			;

			console.log('Injecting jQuery in', win.location.toString());
			var script = '';
			script += '!(function(){';
			script += '\n' + jquerySrc;
			script += '\njQuery.noConflict();';
			script += '\nvar $ = jQuery;';
			script += '\ntry{\n' + scripts + '\n}catch(_E){ console.error(_E); }';
			script += 'console.log("script injected in", location.toString());';
			script += '\n}());';

			var s = doc.createElement('script');
			s.type = 'text/javascript';
			s.innerHTML = script;
			doc.head.appendChild(s);
		}
	};

	Web.prototype._refreshInterval = function(){
		if(!!this.config.refresh){
			var time = this.config.refresh * 60000;
			this._refreshTimer = setInterval(this.refresh.bind(this), time);
		}
	};

	Web.prototype.refresh = function(){
		this._clean();

		this.iframe.contentWindow.location.reload();
	};

	Web.prototype.getPosition = function(){
		return this.$iframe.position();
	};

	Web.prototype.remove = function() {
		clearInterval(this._refreshTimer);
		this.$iframe.off('.web');
		this.$iframe.remove();
	};

	Web.prototype._clean = function(){
		this.$iframe.css('opacity', 0);

		if(!!this._mouseTrapInstance){
			this._mouseTrapInstance.shutdown();
		}
	};

	return Web;
});