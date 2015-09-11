define([
	'jquery'
], function(
	$
){

	'use strict';

	var dfd;

	$(document).ready(function() {
		$('#alert button').click(function(){
			dfd.resolve();
		});
	});

	window.alert = function() {
		dfd = $.Deferred();
		$('#alert .modal-body p').text(arguments[0]);
		$('#alert').modal('show');

		return dfd;
	};

	window.hideModal = function() {
		$('#alert').modal('hide');
	};

});