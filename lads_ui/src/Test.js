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
		this.state ={data:[{'ID':'empty', 'Image':'', 'Names':'', 'Status':'', 'loggingOK':''}]};
	}
	getJSON(url){
		fetch(url)
		  .then(response => response.json())
		  .then(json => this.setState({data:json}))
		  .catch(error => console.log(error));
  	}
  	print(){
  		var formatted =[];
  		var temp;
  		for(var i = 0; i < this.state.data.length; i++){
  			temp = this.state.data[i];
  			formatted.push(temp.ID + '\t' + temp.Image + '\t' + temp.Names + '\t' + temp.Status);
  		}
  		return (formatted);
  	}
  	render(){
  		this.getJSON("http://localhost:4000/dockercontainers");
	    return(
	        <Container><h4>Test</h4>{this.print()}</Container>
	    )
	}
}
export default Test;