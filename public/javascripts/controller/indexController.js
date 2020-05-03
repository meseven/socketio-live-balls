app.controller('indexController', ['$scope', 'indexFactory', 'configFactory', ($scope, indexFactory, configFactory) => {

	$scope.messages = [ ];
	$scope.players = { };

	$scope.init = () => {
		const username = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
		if (username)
			initSocket(username);
		else
			return false;
	};

	function scrollTop() {
		setTimeout(() => {
			const element = document.getElementById('chat-area');
			element.scrollTop = element.scrollHeight;
		});
	}

	function bubbleLifeTime(message) {
		const min = 500;  // min bubble life time
		const max = 3000; // max bubble life time
		const msPerLetter = 40; // miliseconds per letter
		let bubbleTime;

		bubbleTime = min + (message.length * msPerLetter);

		if (bubbleTime > max)
			return max;
		else
			return bubbleTime;

	}

	function showBubble(id, message) {
		$('#'+ id).find('.message').show().html(message);

		setTimeout(() => {
			$('#'+ id).find('.message').hide();
		}, bubbleLifeTime(message));
	}

	async function initSocket(username) {
		const connectionOptions = {
			reconnectionAttempts: 3,
			reconnectionDelay: 600
		};

		try{
			const sockerUrl = await configFactory.getConfig();
			const socket = await indexFactory.connectSocket(sockerUrl.data.socketUrl, connectionOptions);

			socket.emit('newUser', { username });

			socket.on('initPlayers', (players) => {
				$scope.players = players;
				$scope.$apply();
			});

			socket.on('newUser', (data) => {
				const messageData = {
					type: {
						code: 0, // server or user message
						message: 1 // login or disconnect message
					}, // info
					username: data.username,

				};

				$scope.messages.push(messageData);
				$scope.players[data.id] = data;
				scrollTop();
				$scope.$apply();
			});

			socket.on('disUser', (data) => {
				const messageData = {
					type: {
						code: 0,
						message: 0
					}, // info
					username: data.username
				};

				$scope.messages.push(messageData);
				delete $scope.players[data.id];
				scrollTop();
				$scope.$apply();
			});

			socket.on('animate', data => {
				$('#'+ data.socketId).animate({ 'left': data.x, 'top': data.y }, () => {
					animate = false;
				});
			});

			socket.on('newMessage', message => {
				$scope.messages.push(message);
				$scope.$apply();
				showBubble(message.socketId, message.text)
				scrollTop();
			});

			let animate = false;
			let objSize, X, Y = 0;
			//let maxH = $(window)[0].innerHeight;
			//let maxW = $(window)[0].innerWidth;
			$scope.onClickPlayer = ($event) => {
				objSize = $('#'+ socket.id)[0].offsetWidth;
				objC = objSize/2;
				x = $event.offsetX - objC;
				y = $event.offsetY - objC;
				// taşan kısımlar için bir ayarlama yapılabilir.
				if (!animate){
					socket.emit('animate', { x, y });
					animate = true;
					$('#'+ socket.id).animate({ 'left': x, 'top': y }, () => {
						animate = false;
					});
				}
			};
			// Change Button click
			$scope.onClickChange =($event)=>{
				$('span.change').css('display','block');
			}
			// Change Nicname
			$scope.onClickNickChange =($event)=>{
				$('span.change').css('display','none');
				const name = $('input').val();
				if(name!==""){
					username = name;
					socket.emit('nickname', name);
				}
			}
			// Change background
			$scope.onClickBgChange =($event)=>{
				$('span.change').css('display','none');
				var imageUrl = "https://source.unsplash.com/random/1920x1080";
				$('html').css("background-image", "url(" + imageUrl + ")");
			}
			// Focus input
			window.addEventListener("keyup", function(e){
				$('input').focus();
			});
			// scroll
			/*window.addEventListener('mousewheel', function(e) {
				//console.log(e.deltaY);
			});*/

			$scope.newMessage = () =>{
				let message = $scope.message;
				if(message && message!=="" && message.length>1){
					const messageData = {
						type: {
							code: 1, // server or user message
						},
						username: username,
						text: message
					};
	
					$scope.messages.push(messageData);
					$scope.message = '';
	
					socket.emit('newMessage', messageData);
	
					showBubble(socket.id, message);
					scrollTop();
				}
			};
		}catch(err){
			console.log(err);
		}
	}
}]);
