import React from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


class Agent extends React.Component {
	constructor(props){
		super(props);
		this.state = {data:[]};
		this.getJSON('http://localhost:4000/dockercontainers');
	}
	intervalId = null;
	async getJSON(url){
	    fetch(url)
	      .then(response => response.json())
	      .then(json => this.setState({data:json}))
	      .catch(error => console.log(error));
    }
	print(){
		var filtered = [...this.state.data];
		for(var idx in filtered){
			if(filtered[idx].loggingOK == "False"){
				filtered.splice(idx,1);
			}
		}
		return filtered.map((el, i) => 
		    <div id={el.ID} key={i}>
		      <Row>
		        <Col>{el.ID}</Col>
		        <Col>{el.Names}</Col>
		        <Col>{el.Status}</Col>
		    </Row>
		    </div>          
		)
	}

	//Fetch logs every x*1000 seconds
	wowie = setInterval(() => {
		this.getJSON('http://localhost:4000/dockercontainers');
		this.render();
		console.log(Date().toLocaleString())
	},5*1000);		

	render(){
		setInterval(console.log(Date().toLocaleString()),5000);
		return(
			<div className="Agent">
				<Container className="Agent-header">{this.props.id}</Container>
				<Container className="Agent-body" id={this.props.id}>
					{this.print()}
				</Container>
			</div>
		);
	}
}

export default Agent;