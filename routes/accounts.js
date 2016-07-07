'use strict';

const passport = require('passport'),
	Account = require('../models/account'),
	ensureAuthenticated = (req, res, next)  => {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/');
		}
	};

module.exports = () => {
	app.get('/account', ensureAuthenticated, (req, res) => {
		res.render('page-account', {
			username: req.user.username,
			verified: req.user.verified
		});
	});

	app.post('/account/change-password', ensureAuthenticated, (req, res) => {
		let newPassword = req.body.newPassword,
			newPasswordConfirm = req.body.newPasswordConfirm,
			user = req.user;

		if (newPassword !== newPasswordConfirm) {
			res.status(401).json({message: 'not equal'});
			return;
		}

		user.setPassword(newPassword, () => {
			user.save();
			res.send();
		});
	});

	app.post('/account/signup', (req, res, next) => {
		const { username, password, password2, email } = req.body,
			save = {
				username,
				gameSettings: {
					disablePopups: false,
					enableTimestamps: false,
					disableRightSidebarInGame: false,
					enableDarkTheme: false
				},
				verification: {
					email: email || '',
					verificationToken: '',
					verificationTokenExpiration: new Date(),
					passwordResetToken: '',
					passwordResetTokenExpiration: new Date()
				},
				verified: false,
				games: [],
				wins: 0,
				losses: 0,
				created: new Date()
			};

		if (!/^[a-z0-9]+$/i.test(username)) {
			res.status(401).json({message: 'Sorry, your username can only be alphanumeric.'});
		} else if (username.length < 3) {
			res.status(401).json({message: 'Sorry, your username is too short.'});
		} else if (username.length > 12) {
			res.status(401).json({message: 'Sorry, your username is too long.'});
		} else if (password.length < 7) {
			res.status(401).json({message: 'Sorry, your password is too short.'});
		} else if (password.length > 255) {
			res.status(401).json({message: 'Sorry, your password is too long.'});
		} else if (password !== password2) {
			res.status(401).json({message: 'Sorry, your passwords did not match.'});
		} else {
			Account.findOne({username}, (err, account) => {
				if (err) {
					return next(err);
				}
				
				if (account) {
					res.status(401).json({message: 'Sorry, that account already exists.'})
				} else {
					Account.register(new Account(save), password, (err) => {
						if (err) {
							return next(err);
						}

						passport.authenticate('local')(req, res, () => {
							if (email) {
								require('./verify-account')(req, res);
							} else {
								res.send();
							}
						});
					});
				}
			});
		}
	});

	app.post('/account/signin', passport.authenticate('local'), (req, res) => {
		res.send();
	});

	app.post('/account/logout', ensureAuthenticated, (req, res) => {
		req.logOut();
		res.send();
	});

	// app.post('/account/delete-account', passport.authenticate('local'), (req, res) => {
				// todo-release
	// });
};