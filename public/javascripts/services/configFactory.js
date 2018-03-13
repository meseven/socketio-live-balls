app.factory('configFactory', ['$http',($http) => {
	const getConfig = () => {
		return new Promise((resolve, reject) => {
			$http
				.get('/getEnv')
				.then((data) => {
					resolve(data);
				})
				.catch((err) => {
					reject(err);
				})
		});
	};

	return {
		getConfig
	}
}]);
