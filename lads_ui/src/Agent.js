import React from 'react';
import './App.css';
import {getJSON} from './testLogs.js';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class Agent extends React.Component {
	getLogs(){
		var json = getJSON();
		//console.log(json);
		var logs = [];
		//console.log(json[1].id);
		for (let key in json){
			logs.push(<Row><Col>{json[key].ID}</Col><Col>{json[key].Names}</Col><Col>{json[key].Status}</Col></Row>);
		}
		return (logs);
	}
		
	render(){
		return(
			<div className="Agent">
				<Container className="Agent-header">Agent {this.props.id}</Container>
				<Container className="Agent-body">
					{this.getLogs()}
				</Container>
			</div>
		);
	}
}

export default Agent;