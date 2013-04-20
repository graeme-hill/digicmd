// window.App = Ember.Application.create();

// App.ApplicationController = Ember.Controller.extend({
// 	firstName: "Graeme",
// 	lastName: "Hill"
// });

var app = (function() {
	return {
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
		}
	};
})();

function IssuesCtrl($scope) {
	
	var reload = function() {
		app.get({
			url: '/api/v1/issues',
			success: function(response) { $scope.issues = response; }
		});
	}
	reload();

	$scope.addIssue = function() {
		app.post({
			url: "/api/v1/issues", 
			data: { name: $scope.name },
			success: function() { reload(); }
		});
	};
}