define([
	'Web',
	'utils'
], function(
	Web,
	utils
){

	'use strict';

	var openedWebs = [],
		currentConfig
	;

	function getConfig(config, generalConfig) {
		if(typeof config === 'string') {
			if(generalConfig.hasOwnProperty(config)) {
				return generalConfig[config];
			} else {
				alert('The Key ' + config + 'wasn\'t found in the config file');
			}
		} else {
			return config;
		}
	}

	/**
	 * Returns false when the new array is very different form current,
	 * otherwise true if are equals or returns the objects where added
	 * @param  {[type]} current [description]
	 * @param  {[type]} new     [description]
	 * @return {[type]}         [description]
	 */
	function compareArray(current, newConfig) {
		if(current.length <= newConfig.length) {
			var cItem, nItem;
			for(var i = 0; i < current.length; i++) {
				cItem = current[i]; nItem = newConfig[i];
				if(cItem !== nItem) {
					return false; // order has change or something was erased
				}
			}
			var newItems = [];
			for(i++; i < newConfig.length; i++) {
				nItem = newConfig[i];
				newItems.push(nItem);
			}
			return newItems;
		} else {
			// something was erased
			return false;
		}
	}

	function webs(config, generalConfig) {
		if(config === null) {
			return;
		}

		var realConfig = getConfig(config, generalConfig);
		for(var i=0; i < realConfig.length; i++){
			openedWebs.push(
				new Web(realConfig[i])
			);
		}
		currentConfig = realConfig;
	}

	webs.onRefreshConfig = function(config, generalConfig){
		var realConfig = getConfig(config, generalConfig);

		var result = utils.compareConfigArrayWDiff(currentConfig, realConfig)

		if(result === false) {
			// clean and restart
			openedWebs.forEach(function(web){
				web.remove();
			});

			openedWebs = [];

			webs(config, generalConfig);
		} else if(!!result) {
			for(var i=0; i < result.length; i++){
				if(result[i] !== false) {
					openedWebs[i].remove();
					openedWebs[i] = new Web(result[i])
				}
			}
			currentConfig = realConfig;
		}

	};

	return webs;
});