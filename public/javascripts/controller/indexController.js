app.controller('indexController', ['$scope', 'indexFactory', ($scope, indexFactory) => {

	$scope.messages = [ ];

	$scope.init = () => {
		const username = prompt('Please enter username');

		if (username)
			initSocket(username);
		else
			return false;
	};


	function initSocket(username) {
		const connectionOptions = {
			reconnectionAttempts: 3,
			reconnectionDelay: 600
		};

		indexFactory.connectSocket('http://localhost:3000', connectionOptions)
			.then((socket) => {
				socket.emit('newUser', { username });

				socket.on('newUser', (data) => {
					const messageData = {
						type: 0, // info
						username: data.username
					};

					$scope.messages.push(messageData);
					$scope.$apply();
				});
			}).catch((err) => {
				console.log(err);
			});
	}

}]);
