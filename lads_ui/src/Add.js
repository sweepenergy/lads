import React, {useReducer, useState} from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import fuckme from './AppFetch.js';

// async function getJSON(url) {
//     const response = await axios.get(url);
//     return response.data;
// }
// function displayLogs(url){
//   var json = [];
//   getJSON(url).then(data => {
//     for(var x in data){
//       json.push(data[x]);
//     }
//     console.log(json);
//     //return data;
//   });
//   console.log(json);
//   return json;
//   // console.log(json);

//   // var logs = [];
//   // for(var key = 0; key < json.length; key++){
//   //   console.log(json[key].ID);
//   //   logs.push(<p><label><Row><Col><input type="checkbox" name={json[key].ID} onChange={handleChange} /></Col><Col>{json[key].Images}</Col><Col>{json[key].Names}</Col><Col>{json[key].Status}</Col></Row></label></p>);
//   // }
// }



// function fuckme(url, divID){
//   let request = new XMLHttpRequest();
//   request.open('GET', url);
//   request.responseType = 'json';
//   request.onload = function() {
//     console.log(request.response);
//     var json = (request.response);

//     var element = document.querySelector("#fucku");
//     element.innerHTML = "";
//     console.log(json);
//     for(var key = 0; key < json.length; key++){
//       console.log(json[key]);
//       element.innerHTML += '<label>'
//       let p = '<div class="row"><div class="col"><input type="checkbox" name=' + json[key].ID + ' onChange={handleChange} id="container"/></div><div class="col">'+json[key].ID+'</div><div class="col">'+json[key].Names+'</div><div class="col">'+json[key].Status+'</div></div>';
//       console.log(p);
//       element.innerHTML += (p);
//       element.innerHTML += '<\label>'
//     }
//   };
//   console.log(request);
//   request.send();
// }

function Add() {
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
      &nbsp;
			<form onSubmit={handleSubmit}>
				<fieldset>
					<p>
        			<label>
        				Source: &nbsp;
          				<select name="source" onChange={handleChange} value={formData.source || ''}>
          					<option value="">--Select--</option>
          					<option value="docker">Docker</option>
          					<option value="cassandra">Cassandra</option>
      					</select>
        			</label>
        	</p>
        			{formData.source == 'cassandra' ?
        					<p><label>File Path: &nbsp;<input name="filepath" onChange={handleChange} value={formData.filepath || ''}/></label></p>
        					: 
        					formData.source == 'docker' ? 
                      <p><Container id="fucku">{fuckme('http://localhost:4000/dockercontainers','fucku')}</Container></p>
                      : 
                      <p></p>
        			}
    			</fieldset>
    			<Button type="submit" value="Submit">Submit</Button>
  			</form>
		</Container>
	);
}

export default Add;