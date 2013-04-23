App.defineVM('Master', function() {
	var me = this;
	me.currentViewModel = ko.observable(new App.ViewModels.Login());

	me.login = function() {
		me.currentViewModel(new App.ViewModels.Home());
	};

	me.logout = function() {
		me.currentViewModel(new App.ViewModels.Login());
	};
});