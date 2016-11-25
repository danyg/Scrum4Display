define([
	'jquery',
	'bootstrap'
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

	window.alert = function(text, title) {
		dfd = $.Deferred();

		if(!!title) {
			$('#alert .modal-title').text(title);
		} else {
			$('#alert .modal-title').text('Alert!');
		}

		$('#alert .modal-body p').html(text.replace(/\n/g, '<br/>'));
		$('#alert').modal('show');

		return dfd;
	};

	window.hideModal = function() {
		$('#alert').modal('hide');
	};

});