App.defineVM('Home', function() {
	this.logout = function() {
		App.masterViewModel.logout();
	};
});