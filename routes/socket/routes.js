'use strict';

import { sendGameList, createGame, sendGameInfo, updateSeatedUsers } from './game.js';

export default () => {
	io.on('connection', (socket) => {
		// Object.keys(socket.handshake.session.passport).length > 0
		// console.log(socket.handshake.session.passport);

		socket.on('getGameInfo', (uid) => {
			sendGameInfo(socket, uid);
		});
		
		socket.on('createGame', (game) => {
			createGame(socket, game);
		});

		socket.on('getGameList', sendGameList);

		socket.on('updateSeatedUsers', (data) => {
			updateSeatedUsers(socket, data);
		});
	});
}