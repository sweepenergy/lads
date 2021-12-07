import React from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class Agent extends React.Component {
	constructor(props){
		super(props);
		this.state = {data:[],filtered:[],printed:'',changed:false};
		this.getJSON('http://localhost:4000/dockercontainers');
	}
	intervalId = null;
	async getJSON(url){
	    fetch(url)
	      .then(response => response.json())
	      .then(json => {
	      	if(JSON.stringify(this.state.filtered) != '[]' ){
		      	var eq = (JSON.stringify(this.filter(json)) === JSON.stringify(this.state.filtered));
		      	console.log(eq);
		      	this.setState({changed:!eq});

	      	}
	      	this.setState({data:json});
	      	this.setState({filtered:this.filter(this.state.data)});
	      })
	      .catch(error => console.log(error));
    }
    filter(arr){
    	var f = [];
		for(var idx in arr){
			if(arr[idx].loggingOK == "True"){
				f.push(arr[idx]);
			}
		}
		return f;
    }
	print(){
		return this.state.filtered.map((el, i) => 
		    <div id={el.ID} key={el.ID} className={this.state.changed ? 'update' : 'log'}>
		      <Row>
		        <Col>{el.ID}</Col>
		        <Col>{el.Names}</Col>
		        <Col>{el.Status}</Col>
		    </Row>
		    </div>         
		)
	}

	// Fetch logs every x seconds
	wowie = setInterval(() => {
		this.getJSON('http://localhost:4000/dockercontainers');
		this.setState({printed:this.print()});
		console.log(Date().toLocaleString())
	},15*1000);

	render(){
		return(
			<div className="Agent">
				<Container className="Agent-header">{this.props.id}</Container>
				<Container className="Agent-body" id={this.props.id} >
					{this.print()}
				</Container>
			</div>
		);
	}
}

export default Agent;