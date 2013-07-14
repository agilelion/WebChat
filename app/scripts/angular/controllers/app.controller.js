WebChat.controller('AppController',	['$rootScope', '$scope', '$window', 'server', 'beeper', 'counter',	function($rootScope, $scope, $window, server, beeper, counter) {

	var title = 'Web Chat';

	function serverConnected() {
		console.log('WebChat is ready!');
	}

	function updateUserNick(nick) {
		$scope.user.newNick = nick;
	}

	function loggedIn() {
		$scope.user.nick = $scope.user.newNick;
		$scope.user.loggedIn = true;
		bindCounter();
	}

	function bindCounter() {
		$window.addEventListener('focus', disableCounter);
		$window.addEventListener('blur', enableCounter);
	}

	function displayCounter() {
		$scope.title = title + ' (' + counter.getValue() + ')';
	}

	function enableCounter() {
		counter.enable();
	}

	function disableCounter() {
		counter.disable();
		$scope.title = title;
	}

	$scope.title = title;

	// Default user information
	$scope.user = {
		nick: 'אורח',
		newNick: '',
		loggedIn: false
	};

	$scope.templates = {
		userList:		'templates/general/user_list.html',
		loginMessage:	'templates/general/login_message.html',
		chatMessages:	'templates/general/messages.html',
		loginForm:		'templates/forms/login.html',
		messageForm:	'templates/forms/message.html'
	};

	$scope.beeperActive = beeper.isActive;
	$scope.beeperTooltip = beeper.isActive() ? 'Disable sound' : 'Enable sound';

	$scope.toggleBeeper = function() {
		if (beeper.isActive()) {
			beeper.disable();
			$scope.beeperTooltip = 'Enable sound';
		} else {
			beeper.enable();
			$scope.beeperTooltip = 'Disable sound';
		}
	};

	$rootScope.$on('server:connected', function() {
		serverConnected();
	});

	$rootScope.$on('app:login', function(e, nick) {
		updateUserNick(nick);
	});

	$rootScope.$on('app:nickError', function(e) {
		window.alert('הכינוי שבחרת נמצא בשימוש, אנא בחר כינוי אחר.');
	});

	$rootScope.$on('app:loggedIn', function(e) {
		loggedIn();
	});

	$rootScope.$on('chat:message', function(e) {
		beeper.beep();

		if (counter.isActive()) {
			counter.increase();
			displayCounter();
		}
	});

}]).run( ['server', function(server) {

	if ('WebSocket' in window) {
		console.log('Preparing WebChat..');
		server.connect();
	} else {
		console.error('We are sorry, you cannot use WebChat.');
		return false;
	}

}]);