import React from 'react';
import './App.css';
import {getJSON} from './testLogs.js';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import fuckme from './AppFetch.js';


class Agent extends React.Component {
	constructor(props){
		super(props);

		fuckme('http://localhost:4000/dockercontainers','wah');
	}
	// getLogs(){
	// 	var json = getJSON();
	// 	//console.log(json);
	// 	var logs = [];
	// 	//console.log(json[1].id);
	// 	for (let key in json){
	// 		logs.push(<Row><Col>{json[key].ID}</Col><Col>{json[key].Names}</Col><Col>{json[key].Status}</Col></Row>);
	// 	}
	// 	return (logs);
	// }
		
	render(){
		return(
			<div className="Agent">
				<Container className="Agent-header">Agent {this.props.id}</Container>
				<Container className="Agent-body" id="wah">
					wah
				</Container>
			</div>
		);
	}
}

export default Agent;