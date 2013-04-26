App.defineVM('Master', function() {
	var me = this;
	me.currentViewModel = ko.observable(new App.ViewModels.Login());

	me.login = function() {
		debugger;
		me.currentViewModel(new App.ViewModels.Home());
	};

	me.logout = function() {
		debugger;
		me.currentViewModel(new App.ViewModels.Login());
	};
});