'use strict';

let passport = require('passport'),
	Account = require('../models/account'),
	socketRoutes = require('./socket/routes.js');

let ensureAuthenticated = (req, res, next)  => {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/observe');
	}
};

module.exports = () => {
	socketRoutes();
	require('./accounts')();

	app.get('/', (req, res) => {
		if (req.user) {
			res.render('signed-in', {username: req.user.username});
		} else {
			res.render('signed-out');
		}
	});

	app.get('/game', ensureAuthenticated, (req, res) => {
		res.render('game', {user: req.user.username, game: true});
	});

	app.get('/observe', (req, res) => {
		if (req.user) {
			req.session.destroy();
			req.logout();
		}
		res.render('game', {game: true});
	});

	app.get('*', (req, res) => {
		res.render('404');
	});
};