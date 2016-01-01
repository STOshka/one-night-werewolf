'use strict';

import { games } from './game.js';
import { secureGame } from './util.js';
import { sendInprogressChats } from './gamechat.js';
import _ from 'lodash';

export function startGame(game) {
	let allWerewolvesNotInCenter = false,
		assignRoles = () => {
			let _roles = _.clone(game.roles);

			game.internals.seatedPlayers.map((player, index) => {
				let roleIndex = Math.floor((Math.random() * _roles.length)),
					role = _roles[roleIndex];

				if (role === 'werewolf' && !allWerewolvesNotInCenter) {
					allWerewolvesNotInCenter = true;
				}

				player.trueRole = role;
				player.perceivedRole = role;
				player.nightAction = {};
				player.seat = index + 1;
				_roles.splice(roleIndex, 1);
			});

			game.internals.centerRoles = [..._roles];
		};

	Object.keys(game.seated).map((seat, i) => {
		return game.internals.seatedPlayers[i] = {
			userName: game.seated[seat].userName
		};
	});

	assignRoles();

	if (game.kobk && !allWerewolvesNotInCenter) {
		while (!allWerewolvesNotInCenter) {
			assignRoles();
		}
	}

	game.status = 'Dealing..';
	game.tableState.cardsDealt = 'in progress';
	io.in(game.uid).emit('gameUpdate', secureGame(game));

	setTimeout(() => {
		let seconds = 5,
			countDown;

		game.internals.seatedPlayers.forEach((player, i) => {
			player.gameChats = [{
				gameChat: true,
				userName: player.userName,
				chat: `The game begins and you receive the ${player.trueRole.toUpperCase()} role.`,
				seat: i + 1,
				timestamp: new Date()
			}];
		});

		game.internals.unSeatedGameChats.push({
			gameChat: true,
			chat: 'The game begins.',
			timestamp: new Date()
		});

		game.tableState.cardsDealt = true;
		sendInprogressChats(game);
		countDown = setInterval(() => {
			if (seconds === 0) {
				clearInterval(countDown);
				beginNightPhases(game);
			} else {
				game.status = `Night begins in ${seconds} second${seconds === 1 ? '' : 's'}.`;
				sendInprogressChats(game);
			}
			seconds--;
		}, 1000);
	}, 2000);
}

let beginNightPhases = (game) => {
	// round 1: all werewolves minions masons seers and (one robber or troublemaker)
	// round 2 through x: robbercount + troublemaker count minus 1
	// round x+1: all insomniacs

	let phases = [[]],
		roleChangerInPhase1 = false,
		insomniacs = [],
		werewolves, masons;

	game.internals.seatedPlayers.forEach((player) => {
		let playerMap = {
			seer: () => {
				let nightAction = {
					action: 'seer',
					gameChat: 'As a SEER, you wake up, and may look at one player\'s card, or two of the center cards.'
				};

				player.nightAction = nightAction;
				phases[0].push(player);
			},
			robber: () => {
				let nightAction = {
					action: 'robber',
					gameChat: 'As a ROBBER, you wake up, and may exchange your card with another player\'s, and view your new role.'
				};

				player.nightAction = nightAction;

				if (roleChangerInPhase1) {
					phases.push([player]);
				} else {
					roleChangerInPhase1 = true;
					phases[0].push(player);
				}
			},
			troublemaker: () => {
				let nightAction = {
					action: 'troublemaker',
					gameChat: 'As a TROUBLEMAKER, you wake up, and may switch cards between two other players without viewing them.'
				};

				player.nightAction = nightAction;
				player.nightAction.action = 'troublemaker';
				if (roleChangerInPhase1) {
					phases.push([player]);
				} else {
					roleChangerInPhase1 = true;
					phases[0].push(player);
				}
			},
			insomniac: () => {
				let nightAction = {
					action: 'insomniac',
					gameChat: 'As a INSOMNIAC, you wake up, and may view your card again.'
				};

				player.nightAction = nightAction;
				player.nightAction.action = 'insomniac';
				insomniacs.push(player);
			},
			werewolf: () => {
				phases[0].push(player);
			},
			minion: () => {
				phases[0].push(player);
			},
			mason: () => {
				phases[0].push(player);
			}
		};

		playerMap[player.trueRole]();
	});

	if (insomniacs.length) {
		phases.push([...insomniacs]);
	}

	werewolves = phases[0].filter((player) => {
		return player.trueRole === 'werewolf';
	});

	masons = phases[0].filter((player) => {
		return player.trueRole === 'mason';
	});

	phases[0].forEach((player) => {
		let playerMap = {
			werewolf: () => {
				let others = werewolves.map((werewolf) => {
						return werewolf.userName;
					}).filter((userName) => {
						return userName !== player.userName;
					}),
					nightAction = {
						action: 'werewolf',
						others
					},
					message;
			
				if (werewolves.length === 1) {
					message = 'As a WEREWOLF, you wake up, and see no other WEREWOLVES. You may look at a center card';				
				} else {
					message = 'As a WEREWOLF, you wake up, and see that the other WEREWOLVES in this game are:';
				}

				others.forEach((userName) => {
					message += ' ';
					message += userName.toUpperCase();
				});

				message += '.';
				nightAction.gameChat = message;
				player.nightAction = nightAction;
			},
			minion: () => {
				let others = werewolves.map((werewolf) => {
						return werewolf.userName;
					}),
					nightAction = {
						action: 'minion',
						others
					},
					message;

				if (!werewolves.length) {
					message = 'As a MINION, you wake up, and see that there are no WEREWOLVES. Be careful - you lose if no villager is eliminated'
				} else {
					message = 'As a MINION, you wake up, and see that the WEREWOLVES in this game are: ';
				}

				others.forEach((userName) => {
					message += ' ';
					message += userName.toUpperCase();
				});

				message += '.';

				nightAction.gameChat = message;
				player.nightAction = nightAction;
			},
			mason: () => {
				let others = masons.map((mason) => {
						return mason.userName;
					}).filter((userName) => {
						return userName !== player.userName;
					}),
					nightAction = {
						action: 'mason'
					},
					message;

				if (!others.length === 1) {
					message = 'As a MASON, you wake up, and see that you are the only mason';
				} else {
					message = 'As a MASON, you wake up, and see that the MASONS in this game are: ';				
				}

				others.forEach((userName) => {
					message += ' ';
					message += userName.toUpperCase();
				});

				message += '.';			

				nightAction.gameChat = message;
				player.nightAction = nightAction;
			},
			troublemaker: () => {
				return;
			},
			robber: () => {
				return;
			}
		};

		playerMap[player.trueRole]();
	});

	game.tableState.isNight = true;
	game.status = 'Night begins..';
	sendInprogressChats(game);
	setTimeout(() => { // todo: restructure this so we can have a brief "sleep" for phase 1 players.
		nightPhases(game, phases);
	}, 5000);
}

let nightPhases = (game, phases) => {
	let phasesIndex = 0,
		phasesTimer,
		phasesFn = () => {
			if (phasesIndex === phases.length && phases.length > 1) {
				clearInterval(phasesTimer);
			} else {
				let seconds = 10,
					countDown,
					phasesPlayers = phases[phasesIndex];

				phasesPlayers.forEach((player) => {
					let chat = {
						gameChat: true,
						userName: player.userName,
						chat: player.nightAction.gameChat,
						seat: player.seat,
						timestamp: new Date()
					}
					player.gameChats.push(chat);
				});

				countDown = setInterval(() => {
					if (seconds === 0) {
						clearInterval(countDown);
						phasesPlayers.forEach((player) => {
							player.nightAction = {};
						});
						sendInprogressChats(game);
						phasesIndex++;
					} else {
						game.status = `Night phase ${(phasesIndex + 1).toString()} of ${phases.length} ends in ${seconds} second${seconds === 1 ? '' : 's'}.`;
						sendInprogressChats(game);
					}
					seconds--;
				}, 1000);
			}
		};

	phasesFn();
	
	if (phases.length > 1) {
		phasesTimer = setInterval(phasesFn, 10000);
	}
}