import React from 'react';
import './App.css';
import {getJSON} from './testLogs.js';

class Log extends React.Component {
	render(){
		return(
			<p>empty</p>
		);
	}
}

class Agent extends React.Component {
	getLogs(){
		var json = getJSON();
		//console.log(json);
		var logs = [];
		//console.log(json[1].id);
		for (let key in json){
			logs.push(<div className="row"><div className="col">{json[key].id}</div><div className="col">{json[key].date}</div></div>);
		}
		return (logs);
	}
		
	render(){
		return(
			<div className="Agent">
				<div className="Agent-header"><h4>Agent {this.props.id}</h4></div>
				<div className="container">
					{this.getLogs()}
				</div>
			</div>
		);
	}
}

export default Agent;