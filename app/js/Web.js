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
		this.$container = $('<div class="iframe-container"></div>')
			.appendTo('#container')
		;
		this.$spinner = $('<span class="spinner"><i class="three-quarters-loader"></i></span>')
			.appendTo(this.$container)
			.css('opacity', 1)
		;
		this.$iframe_1 = $('<iframe nwfaketop src="app://scrum4display/notfound.html"/>')
			.appendTo(this.$container)
			.addClass('_1')
		;
		this.$iframe_2 = $('<iframe nwfaketop src="app://scrum4display/notfound.html"/>')
			.appendTo(this.$container)
			.addClass('_2')
		;
		this.$iframes = $(this.$iframe_1).add(this.$iframe_2);

		this.iframe_1 = this.$iframe_1.get(0);
		this.iframe_2 = this.$iframe_2.get(0);

		this.$iframe_1.data('web', this);
		this.$iframe_2.data('web', this);

		this.config = config;
		this._opacity = 1;

		this._refreshCycles = 0;

		this.listenForLoad();
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
		this._getCurrent$Iframe().attr('src', url);
	};

	Web.prototype._setConfig = function(){
		this.$iframe_1.css('z-index', 2);
		this.$iframe_2.css('z-index', 1);

		this._refreshInterval();

		if(!!this.config.type) {
			this.$container.addClass(this.config.type);
		}

		if(!!this.config.top) {
			this.$container.css('top', this.config.top);
		}
		if(!!this.config.left) {
			this.$container.css('left', this.config.left);
		}
		if(!!this.config.bottom) {
			this.$container.css('bottom', this.config.bottom);
		}
		if(!!this.config.right) {
			this.$container.css('right', this.config.right);
		}
		if(!!this.config.width) {
			this.$container.css('width', this.config.width);
		}
		if(!!this.config.height) {
			this.$container.css('height', this.config.height);
		}
		if(!!this.config.zIndex) {
			this.$iframes.css('zIndex', this.config.zIndex);
		}
		if(!!this.config.opacity) {
			this.$container.css('opacity', this.config.opacity);
			this._opacity = this.config.opacity;
		}
	};

	Web.prototype._setEvents = function(){
		this.listenForContextMenu();
	};

	Web.prototype.listenForLoad = function(){
		$(this.$iframes)
			.on('load.web', this._onload.bind(this))
		;
	};

	Web.prototype.listenForContextMenu = function(){
		var me = this;
		$(this._getPreviousIframe().contentWindow).off('contextmenu.web');
		$(this._getCurrentIframe().contentWindow).off('contextmenu.web');
		$(this._getCurrentIframe().contentWindow).on('contextmenu.web', function(e){
			onContextMenu(e, me);
		});
	};

	Web.prototype._onload = function(){
		this._mouseTrapInstance = new IframeMousetrap(this._getCurrentIframe().contentDocument);

		this._setEvents();
		console.log(this._getCurrentIframe().contentDocument.location.toString(), 'Loaded');
		this._injectStyles();
		this._injectScripts();
		this._getCurrent$Iframe()
			.css('zIndex', 2)
		;
		this._getPrevious$Iframe()
			.css('zIndex', 1)
		;
		this._getCurrent$Iframe()
			.css('opacity', 1)
		;
		this.$spinner.css('opacity', 0);
	};

	Web.prototype._injectStyles = function(){
		if(!!this.config.styles){
			var $styles = $('<style type="text/css">' + this.config.styles + '</style>');
			$('head', this._getCurrentIframe().contentDocument).append($styles);
		}
	};

	Web.prototype._injectScripts = function(){
		if(!!this.config.scripts){
			var $iframe = this._getCurrent$Iframe(),
				scripts = this.config.scripts,
				doc = this._getCurrentIframe().contentDocument,
				win = this._getCurrentIframe().contentWindow
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
		this.$spinner.css('opacity', 1);
		this._refreshCycles++;
		this._clean();

		this._getCurrent$Iframe().attr('src', this.config.url);
	};

	Web.prototype.getPosition = function(){
		return this.$container.position();
	};

	Web.prototype.remove = function() {
		clearInterval(this._refreshTimer);
		this.$iframes.off('.web');
		this.$container.remove();
	};

	Web.prototype._clean = function(){
		this._getCurrent$Iframe().css('opacity', 0);

		if(!!this._mouseTrapInstance){
			this._mouseTrapInstance.shutdown();
		}
	};

	Web.prototype._getCurrent$Iframe = function(){
		return this._refreshCycles%2 === 0 ? this.$iframe_1 : this.$iframe_2;
	};

	Web.prototype._getPrevious$Iframe = function(){
		return this._refreshCycles%2 === 1 ? this.$iframe_1 : this.$iframe_2;
	};

	Web.prototype._getCurrentIframe = function(){
		return this._refreshCycles%2 === 0 ? this.iframe_1 : this.iframe_2;
	};

	Web.prototype._getPreviousIframe = function(){
		return this._refreshCycles%2 === 1 ? this.iframe_1 : this.iframe_2;
	};

	return Web;
});