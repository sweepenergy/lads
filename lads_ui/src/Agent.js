import React from 'react';
import './App.css';

class Log extends React.Component {
	render(){
		return(
			<p>empty</p>
		);
	}
}

class Agent extends React.Component {
	getLogs(){
		var logs = [];
		for (var i = 0; i < 8; i++){
			logs.push(<p>log {i} </p>);
		}
		return (logs);
	}
	render(){
		return(
			<div className="Agent">
				<div className="Agent-header"><h4>Agent {this.props.id}</h4></div>
				<div class="container">
					{this.getLogs()}
				</div>
			</div>
		);
	}
}

export default Agent;