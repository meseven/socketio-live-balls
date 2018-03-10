app.controller('indexController', ['$scope', 'indexFactory', ($scope, indexFactory) => {

	const connectionOptions = {
		reconnectionAttempts: 3,
		reconnectionDelay: 600
	};

	indexFactory.connectSocket('http://localhost:3001', connectionOptions)
		.then((socket) => {
			console.log('bağlantı gerçekleşti', socket);
		}).catch((err) => {
			console.log(err);
		});

}]);