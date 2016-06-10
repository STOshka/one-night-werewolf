'use strict';

import React from 'react';

export default class Gamechat extends React.Component {
	constructor() {
		this.state = {
			lock: false,
			inputValue: ''
		};
	}

	componentDidMount() {
		this.scrollChats();
	}

	componentDidUpdate() {
		this.scrollChats();
	}	

	handleChatClearClick(e) {
		this.setState({inputValue: ''});
	}

	handleKeyup(e) {
		this.setState({inputValue: `${e.target.value}`});
	}

	handleSubmit(e) {
		const inputValue = this.state.inputValue;

		e.preventDefault();

		if (inputValue.length) {
			this.props.socket.emit('addNewGeneralChat', {
				userName: this.props.userInfo.userName,
				chat: inputValue
			});

			this.setState({inputValue: ''});
		}
	}

	scrollChats() {
		const chatsContainer = document.querySelector('.genchat-container');
			
		if (!this.state.lock) {
			chatsContainer.scrollTop = 999;
		}
	}

	processChats() {
		return this.props.generalChats.map((chat, i) => {		
			return (
				<div className="item" key={i}>
					<span className={chat.userName === 'coz' ? 'chat-user admin' : chat.userName === 'stine' ? 'chat-user admin' : 'chat-user'}>{chat.userName}: </span>
					<span>{chat.chat}</span>
				</div>
			);
		});
	}

	handleChatLockClick(e) {
		this.setState({lock: !this.state.lock});
	}

	render() {
		return (
			<section className="generalchat">
				<section className="generalchat-header">
					<div className="clearfix">
						<h3 className="ui header">Chat</h3>
						<i className={this.state.lock ? 'large lock icon' : 'large unlock alternate icon'} onClick={this.handleChatLockClick.bind(this)}></i>
					</div>
					<div className="ui divider right-sidebar-divider"></div>
				</section>
				<section className="segment chats">
					<div className="ui list genchat-container">
						{this.processChats()}
					</div>
				</section>
				<form className="segment inputbar" onSubmit={this.handleSubmit.bind(this)}>
					<div className={this.props.userInfo.userName ? 'ui action input' : 'ui action input disabled'}>
						<input placeholder="Chat.." value={this.state.inputValue} onChange={this.handleKeyup.bind(this)} maxLength="300"></input>
						<button className={
							(() => {
								let classes = 'ui primary button';

								if (!this.state.inputValue.length) {
									classes += ' disabled';
								}

								return classes;
							})()
						}>Chat</button>
					</div>
					<i className={
						(() => {
							let classes = 'large delete icon'

							if (!this.state.inputValue.length) {
								classes += '  app-hidden';
							}

							return classes;
						})()
					} onClick={this.handleChatClearClick.bind(this)}></i>
				</form>
			</section>
		);
	}
};