'use strict';

import React from 'react';
import $ from 'jquery';
import Popup from 'semantic-ui-popup';
import Dropdown from 'semantic-ui-dropdown';
import Progress from 'semantic-ui-progress';

$.fn.dropdown = Dropdown;
$.fn.popup = Popup;
$.fn.progress = Progress;

export default class Table extends React.Component {
	constructor() {
		
	}

	componentDidMount() {

	}

	leaveGame(el) {
		this.props.updateSeatedUsers(null, this.props.userInfo);
	}

	clickedSeat(el) {
		let seated = this.props.gameInfo.seated,
			userInfo = this.props.userInfo,
			$seat = $(el.currentTarget);

		console.log(this.props.userInfo);

		if (userInfo.userName) {
			if ($seat.hasClass('empty') && !userInfo.isSeated) {
				this.props.updateSeatedUsers($seat.attr('data-seatnumber'), userInfo);
			}
		} else {
			// popup something that tells them they must be signed in to play
		}
	}

	render() {
		return (
			<section className="table">
				<div className="tableimage"></div>
				{[1,2,3,4,5,6,7].map((el) => {
					let seated = this.props.gameInfo.seated[`seat${el}`],
						classes = () => {
							return seated ? `seat seat${el}` : `seat seat${el} empty`;
						},
						seatNumber = () => {
							return el;
						},
						user = seated ? this.props.gameInfo.seated[`seat${el}`].userName : 'Empty seat';
					
					return <div key={el} className={classes()} data-seatnumber={seatNumber()} onClick={this.clickedSeat.bind(this)}>{user}</div>
				})}
				<div className="seat mid1"></div>
				<div className="seat mid2"></div>
				<div className="seat mid3"></div>
				<i className="remove icon" onClick={this.leaveGame.bind(this)}></i>
			</section>
		);
	}
};