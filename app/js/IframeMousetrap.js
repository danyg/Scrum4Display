define(['mousetrap'], function(Mousetrap){

	'use strict';

	var utils = require('util'),
		instances = []
	;

	function IframeMousetrap(a){
		var self = new Mousetrap(a);

		/*self._instanceId = instances.push(this);

		self._originalHandleKey = this._handleKey;
		self._handleKey = IframeMousetrap.prototype._handleKey;*/
		self.handleKey = IframeMousetrap.prototype.handleKey;
		self.shutdown = IframeMousetrap.prototype.shutdown;

		return self;
	}

	IframeMousetrap.prototype.shutdown = function() {
		this._handleKey = function(){}; //:(
	};

	IframeMousetrap.prototype.handleKey = function() {
		return Mousetrap.handleKey.apply(Mousetrap, arguments);
	};

	return IframeMousetrap;

});