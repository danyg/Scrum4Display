/*
* @Author: Daniel Goberitz
* @Date:   2016-11-26 10:00:58
* @Last Modified by:   danyg
* @Last Modified time: 2016-11-26 11:14:55
*/

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


	const cwd = env.getcwd();
	const remote = require('electron').remote;
	const {MenuItem, Menu} = remote;

	var contextMenu = new Menu,
		focusedWeb,
		guestID=0;
	;

	function onContextMenu(event, web){
		focusedWeb = web;
		var pos = {
			left: parseInt(event.pageX, 10),
			top: parseInt(event.pageY, 10),
		};

		contextMenu.popup(pos.left, pos.top);
	}

	function getStyleInjectScript (url, prepend) {
		var script = `(() => {
			var l = document.createElement('link');	l.rel = 'stylesheet'; l.type = 'text/css';
			l.href = '${url}';
		`;
		if(prepend === true) {
			script += 'document.head.insertBefore( l, document.head.firstChild );';
		} else {
			script += 'document.head.appendChild( l );';
		}
		script += '\n})();';

		return script;
	}

	class Web {
		constructor(config) {
			this.$container = $('<div class="iframe-container"></div>')
				.appendTo('#container')
			;
			this.$spinner = $('<span class="spinner"><i class="three-quarters-loader"></i></span>')
				.appendTo(this.$container)
				.css('opacity', 1)
			;
			this.$iframe_1 = $('<webview src="notfound.html"/>')
				.appendTo(this.$container)
				.addClass('_1')
				.data('webcontents', remote.getGuestWebContents(this._guestID + '_1'))
				.data('web', this)
			;
			this.$iframe_2 = $('<webview src="notfound.html"/>')
				.appendTo(this.$container)
				.addClass('_2')
				.data('webcontents', remote.getGuestWebContents(this._guestID + '_2'))
				.data('web', this)
			;
			this.$iframes = $(this.$iframe_1).add(this.$iframe_2);

			this.iframe_1 = this.$iframe_1.get(0);
			this.iframe_2 = this.$iframe_2.get(0);

			this.config = config;
			this._opacity = 1;
			this._reloadSuspended = false;

			this._reloadCycles = 0;

			this.listenForLoad();
			this.listenEvents();
			this.goHome();
			this._setConfig();

		}


		goHome() {
			this.setUrl(this.config.url);
		}

		setUrl(url) {
			this._clean();
			if(url.indexOf('~') !== -1){
				var local = 'file://' + cwd.indexOf('\\') !== -1 ? '/' + cwd.replace(/\\/g,'/') : cwd;
				url = url.replace('~', local);
			}
			this._getCurrent$Iframe().attr('src', url);
		}

		_setConfig() {
			this.$iframe_1.css('z-index', 2);
			this.$iframe_2.css('z-index', 1);

			this._reloadInterval();

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
		}

		_setEvents() {
			this.listenForContextMenu();
		}

		listenForLoad() {
			var me = this;
			$(this.$iframes)
				// .on('load.web', this._onload.bind(this))
				// .on('did-stop-loading.web', this._onload.bind(this))
				.on('dom-ready.web', function() {
					me._onload(this); // this is the iframe!!!
				})
			;
		}

		listenEvents() {
			$(this.$iframes)
				.on('devtools-opened.web', () => {
					this._suspendReload();
				})
				.on('devtools-closed.web', () => {
					this._resumeReload();
				})
			;

		}

		listenForContextMenu() {
			var me = this;

			$(this._getPreviousIframe()).off('contextmenu.web');
			$(this._getCurrentIframe()).off('contextmenu.web');
			$(this._getCurrentIframe()).on('contextmenu.web', function(e){
				onContextMenu(e, me);
			});
		}

		_onload(iframe) {
			if(this._getCurrentIframe() !== iframe) {
				// we just care of initialize the showing iframe
				return;
			}

			console.log('currentIframeWebContents', this._getCurrentIframeWebContents())
			// this._mouseTrapInstance = new IframeMousetrap(this._getCurrentIframe().contentDocument);
			// this._mouseTrapInstance = new IframeMousetrap(this._getCurrentIframe());

			this._setEvents();
			// console.log(this._getCurrentIframe().contentDocument.location.toString(), 'Loaded');
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
		}

		_injectStyles() {
			var webContents = this._getCurrentIframeWebContents();
			var BASE = __dirname.replace(/\\/g, '/');

			webContents.executeJavaScript(
				getStyleInjectScript(`file://${BASE}/css/baseOverrides.css`, true)
			);

			if(!!this.config.hasOwnProperty('stylesheets') && this.config.stylesheets.hasOwnProperty('length')) {
				this.config.stylesheets.forEach((stylesheet) => {
					webContents.executeJavaScript(
						getStyleInjectScript(stylesheet)
					);
				});
			}

			if(!!this.config.hasOwnProperty('style')){
				webContents.executeJavaScript(`(() => {
					var s = document.createElement('style'); s.type = 'text/css';
					s.innerHTML = \`${this.config.style}\`;
					document.head.appendChild( s );
				})();`);
			}
		}

		_injectScripts() {
			if(!!this.config.scripts || !!this.config.script){
				var $iframe = this._getCurrent$Iframe(),

					scripts = this.config.scripts,
					userScript = this.config.script,

					injectedScript = '',

					webContents = this._getCurrentIframeWebContents()
				;

				if(!!scripts && scripts.hasOwnProperty('length')) {
					injectedScript = `
						function includeScript(src) {
							var s = document.createElement('script');
							s.type = 'text/javascript';
							s.src = src;
							document.head.appendChild(s);
						};
					`
					scripts.forEach((src) => {
						injectedScript += `includeScript('${src}');\n`
					});
				}

				if(!!userScript) {
					injectedScript += '\n/*------- [ USER SCRIPT ] ------- */\n\n' + userScript;
				}

				var script = `(() => {
					/* <----- [ jQuery ] -----> */
					${jquerySrc}
					/* </----- [ jQuery ] -----> */
					jQuery.noConflict();
					var $ = jQuery;
					window._$ = jQuery;
					try {
						${injectedScript}
					} catch(_E) {
						console.error('ERROR INJECTING SCRIPT:', _E);
					}
				})();`

				console.log('INJECTING SCRIPT', injectedScript);

				webContents.executeJavaScript(script)
			}
		}

		_reloadInterval() {
			if(!!this.config.refresh) {
				var time = this.config.refresh * 60000;
				this._reloadTimer = setInterval(this.reload.bind(this), time);
			}
		}

		_suspendReload() {
			this._reloadSuspended = true;
			this.$reloadSuspendedAlert = $('<div class="alert-message label label-info">Reload suspended due Dev Tools Opened</div>');
			this.$reloadSuspendedAlert.appendTo(this.$container);

			if(!!this.config.refresh) {
				clearInterval(this._reloadTimer);
			}
		}

		_resumeReload() {
			this._reloadSuspended = false;
			this.$reloadSuspendedAlert.remove();

			if(!!this.config.refresh) {
				this._reloadInterval();
			}
		}

		reload() {
			if(!this._reloadSuspended) {
				this.$spinner.css('opacity', 1);
				this._reloadCycles++;
				this._clean();

				this._getCurrent$Iframe().attr('src', this.config.url);
			} else {
				this.$reloadSuspendedAlert.addClass('label-warning');
				setTimeout(()=>{
					this.$reloadSuspendedAlert.removeClass('label-warning');
				}, 1000);
			}
		}

		toggleDevTools() {
			this._getCurrentIframeWebContents().toggleDevTools();
		}

		getPosition() {
			return this.$container.position();
		}

		remove() {
			clearInterval(this._reloadTimer);
			this.$iframes.off('.web');
			this.$container.remove();
		}

		_clean() {
			this._getCurrent$Iframe().css('opacity', 0);

			if(!!this._mouseTrapInstance){
				this._mouseTrapInstance.shutdown();
			}
		}

		_getCurrent$Iframe() {
			return this._reloadCycles%2 === 0 ? this.$iframe_1 : this.$iframe_2;
		}

		_getCurrentIframeWebContents() {
			var $iframe = this._getCurrent$Iframe();
			var gid = $iframe.attr('guestinstance');
			return remote.getGuestWebContents(gid);
		}

		_getPrevious$Iframe() {
			return this._reloadCycles%2 === 1 ? this.$iframe_1 : this.$iframe_2;
		}

		_getCurrentIframe() {
			return this._reloadCycles%2 === 0 ? this.iframe_1 : this.iframe_2;
		}

		_getPreviousIframe() {
			return this._reloadCycles%2 === 1 ? this.iframe_1 : this.iframe_2;
		}
 	}

	Web.goHome = function(){
		if(!!focusedWeb){
			focusedWeb.goHome();
		}
	};

	Web.reload = function(){
		if(!!focusedWeb){
			focusedWeb.reload();
		}
	};

	Web.toggleDevTools = function(){
		if(!!focusedWeb){
			focusedWeb.toggleDevTools();
		}
	};

	contextMenu
		.append(new MenuItem({
			label: 'Reload',
			click: Web.reload
		}))
	;
	contextMenu
		.append(new MenuItem({
			label: 'Toggle DevTools',
			click: Web.toggleDevTools
		}))
	;

	return Web;
});