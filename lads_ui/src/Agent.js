import React from 'react';
import './App.css';
import {getJSON} from './testLogs.js';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

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
			logs.push(<Row><Col>{json[key].id}</Col><Col>{json[key].date}</Col></Row>);
		}
		return (logs);
	}
		
	render(){
		return(
			<div className="Agent">
				<div className="Agent-header"><h4>Agent {this.props.id}</h4></div>
				<Container>
					{this.getLogs()}
				</Container>
			</div>
		);
	}
}

export default Agent;