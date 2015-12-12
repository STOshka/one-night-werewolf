'use strict';

import React from 'react';
import $ from 'jquery';
import Popup from 'semantic-ui-popup';
import Dropdown from 'semantic-ui-dropdown';
import Progress from 'semantic-ui-progress';
import Checkbox from 'semantic-ui-checkbox';
import socket from 'socket.io-client';
import { defaultRolesArray } from '../../../../iso/util.js';

$.fn.dropdown = Dropdown;
$.fn.popup = Popup;
$.fn.progress = Progress;
$.fn.checkbox = Checkbox;

socket = socket();

export default class Creategame extends React.Component {
	constructor() {
	}

	componentDidUpdate() {
		
	}

	componentDidMount() {
		let getSettingsFromComponent = () => {
			return {

			}
		};

		$(this.refs.popups).popup({
			inline: true,
			hoverable: true,
			position: 'bottom left',
			delay: {
				show: 300,
				hide: 800
			}
		}).checkbox({
			onChecked: function () {
				socket.emit('updateGameSettings', {
					disablePopups: true
				});
			},
			onUnchecked: function () {
				socket.emit('updateGameSettings', {
					disablePopups: false
				});
			},
		});
	}

	render() {
		return (
			<section className="settings">
				<i className="remove icon" onClick={this.props.routeToDefault}></i>
				<div className="ui header">
					<div className="content">
						Game settings
						<div className="sub header">
							Account settings can be found <a href='/account' target="blank">here</a> (new tab).
						</div>
					</div>
				</div>
				<div className="ui grid">
					<div className="four wide column popups">
						<h4 className="ui header">Disable informational popups</h4>
						<div className="ui fitted toggle checkbox" ref="popups">
							<input type="checkbox" name="popups" defaultChecked={this.props.userInfo.gameSettings.disablePopups}></input>
							<label></label>
						</div>
						<div className="ui small popup transition hidden">
							Disable most popups (but not this one) that explain game terms and concepts.
						</div>
					</div>
				</div>
			</section>
		);
	}
};