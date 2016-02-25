'use strict';

import mongoose from 'mongoose';
import GameSettings from '../../models/gamesettings';
import { games } from './game.js';
import { secureGame, getInternalPlayerInGameByUserName } from './util.js';
import { combineInprogressChats } from './gamechat.js';
import _ from 'lodash';

export let userList = [];

export function checkUserStatus(socket) {
	let { user } = socket.handshake.session.passport,
		gameUserIsIn = games.find((game) => {
			return !!Object.keys(game.seated).find((seat) => {
				return game.seated[seat].userName === user;
			});
		}),
		chats, cloneGame;

	if (gameUserIsIn) {
		let internalPlayer = getInternalPlayerInGameByUserName(gameUserIsIn, user);

		cloneGame = _.clone(gameUserIsIn);
		cloneGame.chats = combineInprogressChats(cloneGame, user);
		// cloneGame.tableState.playerPerceivedRole = internalPlayer.perceivedRole;  // todo: this crashes server if a user logs into a 2nd account on same computer without logging out of old
		socket.join(gameUserIsIn.uid);
		socket.emit('gameUpdate', secureGame(cloneGame));
		socket.emit('updateSeatForUser', internalPlayer.seat); // todo: errors on reload some times
	}

	userList.unshift({
		user
	});

	console.log(userList);

	io.sockets.emit('userList', userList);
};

export function handleUpdatedGameSettings(socket, data) {
	GameSettings.findOne(socket.handshake.session.passport.user, (err, settings) => {
		for (let setting in data) {
			settings.gameSettings[setting] = data[setting];
		}
		settings.save();
		socket.emit('gameSettings', settings);
	});
};

export function sendUserGameSettings(socket) {
	var username;

	try {
		username = socket.handshake.session.passport.user;  // todo: this errors out some times/is undefined
	} catch (e) {
		console.log('sendUserGameSettings errored out');
	}

	GameSettings.findOne({username}, (err, settings) => {
		if (err) {
			console.log(err);
		}

		socket.emit('gameSettings', settings);
	});
};