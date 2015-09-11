(function(){
	'use strict';

	var editor = ace.edit("editor");
	editor.setTheme("ace/theme/twilight");
	editor.getSession().setMode("ace/mode/json");

	(function(){
		var ix=0;

		$(document).ready(function() {
			$('#alert button').click(function(){
				dfd.resolve();
			});
		});

		window._alert = function(text, className) {
			var id = 'alert-' + (ix++);
			$('<div class="alert alert-dismissible ' + className + ' fade in" id="'+ id +'" role="alert">' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>' +
				'<p>'+arguments[0]+'</p>'+
			'</div>').css('opacity', '0').appendTo('#alertBox').css('opacity', '1').alert();

			setTimeout(function() {
				$('#'+id)
					.alert('close')
				;
			}, arguments[0].length * 200);
		};

		window.info = function() {
			window._alert(arguments[0], 'alert-info');
		};

		window.alert = function() {
			window._alert(arguments[0], 'alert-warning');
		};

		window.error = function() {
			window._alert(arguments[0], 'alert-danger');
		}

		window.hideModal = function() {
			$('.alert')
				.alert('close')
			;
		};
	}());

	function filter_errors(item) {
		return (item.type === 'error');
	}

	function loadDocument() {
		info('Loading.');
		$.get('/config.json', function(data) {
			editor.getSession().getDocument().setValue(data);
		});
	}

	function saveDocument() {
		info('Saving!');
		var annotations = editor.getSession().getAnnotations();
		if(annotations.filter(filter_errors).length === 0) {
			var doc = editor.getSession().getDocument();
			$.ajax({
				url: '/config.json',
				type: 'put',
				contentType: 'text/plain',
				data: doc.$lines.join(doc.$autoNewLine)
			})
			.done(function(){
				info('Save successful!');
			})
			.fail(function() {
				error("Error saving, try again.");
			});
		} else {
			alert("Fix the errors before saving.");
		}
	}

	function formatDocument() {
		var doc = editor.getSession().getDocument();
		var json = JSON.parse(doc.$lines.join(doc.$autoNewLine));
		var str = JSON.stringify(json, undefined, '\t');
		doc.setValue(str);
	};

	editor.commands.addCommand({
		name: 'save',
		bindKey: {win: 'Ctrl-S',	mac: 'Command-S'},
		exec: function(editor) {
			saveDocument();
		},
		readOnly: true // false if this command should not apply in readOnly mode
	});
	editor.commands.addCommand({
		name: 'Format',
		bindKey: {win: 'Ctrl-Shift-F',	mac: 'Command-Shift-F'},
		exec: function(editor) {
			formatDocument();
		},
		readOnly: true // false if this command should not apply in readOnly mode
	});

	loadDocument();
	$('[data-toggle="tooltip"]').tooltip();

	$('.BTN_LOAD').click(loadDocument);
	$('.BTN_SAVE').click(saveDocument);
	$('.BTN_FORMAT').click(formatDocument);
}());