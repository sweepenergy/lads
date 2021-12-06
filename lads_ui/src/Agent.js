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

		fuckme('http://localhost:4000/dockercontainers',this.props.id);
	}
		
	render(){
		return(
			<div className="Agent">
				<Container className="Agent-header">{this.props.id}</Container>
				<Container className="Agent-body" id={this.props.id}>
					wah
				</Container>
			</div>
		);
	}
}

export default Agent;