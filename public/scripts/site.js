$(document).ready(function () {  // yay ES5
	$('body').on('click', '#signup', function(event) {
		event.preventDefault();

		$('section.signup-modal')
			.modal('setting', 'transition', 'horizontal flip')
			.modal('show');
	});

	$('button.signup-submit').on('click', function(event) {
		event.preventDefault();
		var username = $('#signup-username').val(),
			password = $('#signup-password').val(),
			$loader = $(this).next(),
			$message = $loader.next(),
			submitErr = function (message) {
				$loader.removeClass('active');
				$message.text(message).removeClass('hidden');
			};

		$loader.addClass('active');

		$.ajax({
			url: '/account/signup',
			method: 'POST',
			contentType: 'application/json; charset=UTF-8',
			data: JSON.stringify({username: username, password: password}),
			statusCode: {
				200: function () {
					if (window.location.pathname === '/observe') {
						window.location.pathname = '/game';
					} else {
						window.location.reload();
					}
				},
				400: function () {
					submitErr('Sorry, that request did not look right.');
				},
				401: function (xhr) {
					let message = typeof xhr.responseJSON !== 'undefined' ? xhr.responseJSON.message : 'Sorry, that username already exists and you did not provide the correct password.';

					submitErr(message);
				}
			}
		});
	});

	$('body').on('click', '#signin', function(event) {
		event.preventDefault();

		$('section.signin-modal')
			.modal('setting', 'transition', 'horizontal flip')
			.modal('show');
	});

	$('body').on('focus', '#signup-username', function () {
		$(this).parent().next().text('3-12 alphanumeric characters.').slideDown();
	});

	$('body').on('focus', '#signup-password', function () {
		$(this).parent().next().text('6-50 characters.').slideDown();
	});	

	$('body').on('blur', '.signup-modal .ui.left.icon.input input', function () {
		$(this).parent().next().slideUp();
	});

	$('button.signin-submit').on('click', function(event) {
		event.preventDefault();
		var username = $('#signin-username').val(),
			password = $('#signin-password').val(),
			$loader = $(this).next(),
			$message = $(this).next().next(),
			submitErr = function (message) {
				$loader.removeClass('active');
				$message.text(message).removeClass('hidden');
			};

		$loader.addClass('active');

		$.ajax({
			url: '/account/signin',
			method: 'POST',
			contentType: 'application/json; charset=UTF-8',
			data: JSON.stringify({username: username, password: password}),
			statusCode: {
				200: function () {
					if (window.location.pathname === '/observe') {
						window.location.pathname = '/game';
					} else {
						window.location.reload();
					}
				},
				400: function () {
					submitErr('Sorry, that request did not look right.');
				},
				401: function () {
					submitErr('Sorry, that was not the correct password for that username.');
				}
			}
		});
	});

	$('a#logout').on('click', function(event) {
		event.preventDefault();
		
		$.ajax({
			url: '/account/logout',
			method: 'POST',
			success: function () {
				window.location.reload();
			}
		});
	});

	$('button#change-password').on('click', function(event) {
		$('section.passwordchange-modal')
			.modal('setting', 'transition', 'horizontal flip')
			.modal('show');
	});

	$('button#passwordchange-submit').on('click', function (event) {
		event.preventDefault();
		
		var newPassword = $('#passwordchange-password').val(),
			newPasswordConfirm = $('#passwordchange-confirmpassword').val(),
			$loader = $(this).next(),
			$errMessage = $loader.next(),
			$successMessage = $errMessage.next(),
			data = JSON.stringify({
				newPassword: newPassword,
				newPasswordConfirm: newPasswordConfirm
			});

		$loader.addClass('active');
		
		$.ajax({
			url: '/account/change-password',
			method: 'POST',
			contentType: 'application/json; charset=UTF-8',
			data: data,
			statusCode: {
				200: function () {
					$loader.removeClass('active');
					$successMessage.removeClass('hidden');
					if (!$errMessage.hasClass('hidden')) {
						$errMessage.addClass('hidden');
					}
				},
				401: function () {
					$loader.removeClass('active');
					$errMessage.text('Your new password and your confirm password did not match.').removeClass('hidden');
					if (!$successMessage.hasClass('hidden')) {
						$successMessage.addClass('hidden');
					}
				}
			}
		});
	});	

	$('button#delete-account').on('click', function(event) {
		$('section.deleteaccount-modal')
			.modal('setting', 'transition', 'horizontal flip')
			.modal('show');
	});

	$('button#deleteaccount-submit').on('click', function (event) {
		return; // todo-release
		event.preventDefault();
		
		var password = $('#deleteaccount-password').val(),
			$loader = $(this).next(),
			$errMessage = $loader.next(),
			$successMessage = $errMessage.next(),
			data = JSON.stringify({password: password});

		$loader.addClass('active');

		$.ajax({
			url: '/account/delete-account',
			method: 'POST',
			contentType: 'application/json; charset=UTF-8',
			data: data,
			statusCode: {
				200: function () {
					$loader.removeClass('active');
					$successMessage.removeClass('hidden');
					setTimeout(function () {
						window.location.reload();
					}, 3000);
					if (!$errMessage.hasClass('hidden')) {
						$errMessage.addClass('hidden');
					}
				},
				400: function () {
					$loader.removeClass('active');
					$errMessage.text('Your password did not match.').removeClass('hidden');
					if (!$successMessage.hasClass('hidden')) {
						$successMessage.addClass('hidden');
					}
				}
			}
		});
	});	
});