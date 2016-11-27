/*
* @Author: Daniel Goberitz
* @Date:   2016-11-26 12:29:55
* @Last Modified by:   danyg
* @Last Modified time: 2016-11-26 12:47:12
*/
define([], () => {

	'use strict';

	/**
	 * Returns false when the new array is very different form current,
	 * otherwise true if are equals or returns the objects where added
	 * @param  {[type]} current [description]
	 * @param  {[type]} new     [description]
	 * @return {[type]}         [description]
	 */
	function compareConfigArray(current, newConfig) {
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

	/**
	 * Returns an array full with false when the element haven't had changed and
	 * the new item when it was
	 * @param  {[type]} current [description]
	 * @param  {[type]} new     [description]
	 * @return {[type]}         [description]
	 */
	function compareConfigArrayWDiff(current, newConfig) {
		if(current.length <= newConfig.length) {
			var cItem, nItem, result = [];
			for(var i = 0; i < current.length; i++) {
				cItem = current[i]; nItem = newConfig[i];
				if(!compareJSONObj(cItem,nItem)) {
					result[i] = nItem;
				} else {
					result[i] = false;
				}
			}

			for(i++; i < newConfig.length; i++) {
				result[i] = nItem;
			}
			return result;
		} else {
			// something was erased
			return false;
		}
	}

	function compareJSONObj(obj1, obj2) {
		return JSON.stringify(obj1) === JSON.stringify(obj2)
	}

	return {
		compareConfigArray: compareConfigArray,
		compareConfigArrayWDiff: compareConfigArrayWDiff,
		compareJSONObj: compareJSONObj
	};
});