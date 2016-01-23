'use strict';

import { combineReducers } from 'redux';
import { UPDATE_USER, updateUser } from '../actions/actions.js';
import { UPDATE_MIDSECTION, updateMidsection} from '../actions/actions.js';
import { UPDATE_GAMELIST, updateGameList} from '../actions/actions.js';
import { UPDATE_GAMEINFO, updateGameInfo} from '../actions/actions.js';
import { UPDATE_USERLIST, updateUserList} from '../actions/actions.js';
import { UPDATE_EXPANDOINFO, updateExpandoInfo} from '../actions/actions.js';

let userInfo = (state = {}, action) => {
	switch (action.type) {
		case UPDATE_USER:
			return state = action.user;
		default:
			return state;
	}
};

let midSection = (state = 'default', action) => {
	switch (action.type) {
		case UPDATE_MIDSECTION:
			return state = action.midsection;
		default:
			return state;
	}
};

let gameList = (state = [], action) => {
	switch (action.type) {
		case UPDATE_GAMELIST:
			return state = action.gameList;
		default:
			return state;
	}
};

let gameInfo = (state = {}, action) => {
	switch (action.type) {
		case UPDATE_GAMEINFO:
			return state = action.gameInfo;
		default:
			return state;
	}
};

let userList = (state = [], action) => {
	switch (action.type) {
		case UPDATE_USERLIST:
			return state = action.userList;
		default:
			return state;
	}
};

let expandoInfo = (state = 'empty', action) => {
	switch (action.type) {
		case UPDATE_EXPANDOINFO:
			return state = action.info;
		default:
			return state;
	}
};

export default combineReducers({
	userInfo,
	midSection,
	gameList,
	gameInfo,
	userList,
	expandoInfo
});