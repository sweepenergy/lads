import React, {useReducer, useState} from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

const formReducer = (state, event) => {
  if(event.reset) {
   return {
     source: '',
     filepath: '',
   }
 }
  return {
    ...state,
    [event.name]: event.value
  }
}

function Add() {
	const [formData, setFormData] = useReducer(formReducer, {});
	const handleSubmit = event => {
		event.preventDefault();
		console.log(event.target);
		alert(Object.entries(formData));
	}
	const handleChange = event => {
    	setFormData({
      		name: event.target.name,
      		value: event.target.value,
    	});
  	}
	return(
		<Container className="Add">
			<h2>Add New Directory</h2>
			<form onSubmit={handleSubmit}>
				<fieldset>
					<p>
        			<label>
        				Source: &nbsp;
          				<select name="source" onChange={handleChange} value={formData.source || ''}>
          					<option value="">--Select--</option>
          					<option value="docker">Docker</option>
          					<option vlue="cassandra">Cassandra</option>
      					</select>
        			</label>
        			</p>
        			<p>
        			<label>
        				File Path: &nbsp;
          				<input name="filepath" onChange={handleChange} value={formData.filepath || ''}/>
        			</label>
        			</p>
    			</fieldset>
    			<Button type="submit" value="Submit">Submit</Button>
  			</form>
		</Container>
	);
}

export default Add;