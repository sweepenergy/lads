import React, {useReducer, useState} from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import fuckme from './AppFetch.js';
import Test from './Test.js';

class Add extends React.Component {
  constructor(props) {
    super(props);
    this.state = {source: '', content:[], data:[]};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  async getJSON(url){
    fetch(url)
      .then(response => response.json())
      .then(json => this.setState({data:json}))
      .catch(error => console.log(error));
    }
    print(){
      return this.state.data.map((el, i) => 
          <div id={el.ID} key={i}>
            <Row>
              <Col><input type="checkbox" name={el.ID} value={this.state.content} onChange={this.handleChange}/></Col>
            <Col>{el.ID}</Col>
            <Col>{el.Names}</Col>
            <Col>{el.Status}</Col>
          </Row>
          </div>          
      )
    }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
    console.log(this.state.content);
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
    this.getJSON("http://localhost:4000/dockercontainers");
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
                      <p><Container fluid id="fucku">{this.print()}</Container></p>
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