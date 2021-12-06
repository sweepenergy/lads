import React, {useReducer, useState} from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import fuckme from './AppFetch.js';
class Add extends React.Component {
  constructor(props) {
    super(props);
    this.state = {source: '', content:''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';

    xhr.onload = function() {

        var status = xhr.status;

        if (status == 200) {
            callback(null, xhr.response);
        } else {
            callback(status);
        }
    };

    xhr.send();
  }

  getLogs(){
    this.getJSON('http://localhost:4000/dockercontainers', function(err, data){
      var json = data;

      var divelement = document.querySelector("#fucku");
      divelement.innerHTML = "";
      //console.log(json);
      for(var key = 0; key < json.length; key++){
        //console.log(json[key]);
        var element = document.createElement('label');
        element.setAttribute('style','width:100%');
        let log = '<div class="row"><div class="col"><input type="checkbox" name=' + json[key].ID + ' onChange={this.handleChange} value={this.state.content}/></div><div class="col">'+json[key].ID+'</div><div class="col">'+json[key].Names+'</div><div class="col">'+json[key].Status+'</div></div>';
        //console.log(p);
        element.innerHTML += (log);
        let p = document.createElement('p');
        p.append(element);
        divelement.append(p);
      }
    })
}

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    alert(this.state.source + ',' + this.state.content);
    event.preventDefault();
    this.handleReset();
  }

  handleReset(){
    this.state.source = '';
    this.state.content = '';
  }

  render() {
    return (
      <Container fluid className="Add">
      <h2>Add New Directory</h2>
      &nbsp;
      <form onSubmit={this.handleSubmit}>
        <fieldset>
          <p>
              <label>
                Source: &nbsp;
                  <select name="source" onChange={this.handleChange} value={this.state.source}>
                    <option value="">--Select--</option>
                    <option value="docker">Docker</option>
                    <option value="cassandra">Cassandra</option>
                </select>
              </label>
          </p>
              {this.state.source == 'cassandra' ?
                  <p><label>File Path: &nbsp;<input name="content" onChange={this.handleChange} value={this.state.content}/></label></p>
                  : 
                  this.state.source == 'docker' ? 
                      <p><Container fluid id="fucku">{this.getLogs()}</Container></p>
                      : 
                      <p></p>
              }
          </fieldset>
          <Button type="submit" value="Submit">Submit</Button>
        </form>
    </Container>
    );
  }
}

export default Add;