import React, {useReducer, useState} from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import fuckme from './AppFetch.js';

class Test extends React.Component {
	constructor(props){
		super(props);
		this.state ={data:[]};
	}
	getJSON(url){
		fetch(url)
		  .then(response => response.json())
		  .then(json => this.setState({data:json}))
		  .catch();
  	}
  	print(){
    	return this.state.data.map((el, i) => 
        	<div id={el.ID} key={i}>
        		<Row>
        			<Col><input type="checkbox" id={el.ID} onChange={this.props.handleChange}/></Col>
	    			<Col>{el.ID}</Col>
	    			<Col>{el.Names}</Col>
	    			<Col>{el.Status}</Col>
    			</Row>
         	</div>          
    	)
  	}
  	render(){
  		this.getJSON("http://localhost:4000/dockercontainers");
	    return(
	        <Container id="dockercontainers">{this.print()}</Container>
	    )
	}
}
export default Test;