window.App = (function() {

	return {
		ViewModels: {},

		bootstrap: function() {
			var mergedJs = null;
			var mergedCss = null;
			var mergedHtml = null;

			function onFileReceived() {
				if (mergedJs != null && mergedCss != null && mergedHtml != null) {
					$('head').append(mergedCss);
					$('head').append(mergedHtml);
					eval(mergedJs);

					App.masterViewModel = new App.ViewModels.Master();
					$('body').html($('#view-master').html());
					ko.applyBindings(App.masterViewModel);
				}
			}

			function loadFile(url, done) {
				$.ajax({
					url: url,
					type: 'GET',
					success: function(response) {
						done(response);
						onFileReceived();
					}
				});
			}

			function loadScript(url, done) {
				$.ajax({
					url: url,
					type: 'GET',
					dataType: 'script',
					complete: function(response) {
						done(response.responseText);
						onFileReceived();
					}
				})
			}

			loadFile('/static/merged.css', function(content) { mergedCss = content; });
			loadScript('/static/merged.js', function(content) { mergedJs = content; });
			loadFile('/static/merged.html', function(content) { mergedHtml = content; });

		},

		callApi: function(args) {
			args.contentType = "application/json";
			args.accepts = "application/json";
			args.dataType = "json";
			if (args.data != null && typeof args.data != "undefined") {
				args.data = JSON.stringify(args.data);
			}
			$.ajax(args);
		},

		get: function(args) {
			args.type = "GET";
			app.callApi(args);
		},

		post: function(args) {
			args.type = "POST";
			app.callApi(args);
		},

		put: function(args) {
			args.type = "PUT";
			app.callApi(args);
		},

		delete: function(args) {
			args.type = "DELETE";
			app.callApi(args);
		},

		defineVM: function(name, viewModel) {
			App.ViewModels[name] = viewModel;
			viewModel.prototype.getViewId = function() {
				return 'view-' + name.toLowerCase();
			};
		}
	};

})();

ko.bindingHandlers.viewModel = {
  update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
  	debugger;
  	$element = $(element);
  	var newVM = valueAccessor()();
  	$element.children().each(function() {
  		ko.cleanNode(this);
  	});
  	if (newVM) {
  		$element.html($('#' + newVM.getViewId()).html());
			$element.children().each(function() {
				ko.applyBindings(newVM, this);
			});
  	} else {  		
  		$element.html('');
  	}
  }
};

App.bootstrap();