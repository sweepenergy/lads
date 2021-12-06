import React from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import ReactCSSTransitionGroup from 'react-transition-group'; // ES6

class Add extends React.Component {
  constructor(props) {
    super(props);
    this.state = {source: '', content:[], data:[], checked:[]};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getJSON("http://localhost:4000/dockercontainers");
  }
  async getJSON(url){
    fetch(url)
      .then(response => response.json())
      .then(json => this.setState({data:json}))
      .catch(error => console.log(error));
    }
  print(){
    return this.state.content.map((el, i) => 
        <div id={el.ID} key={i}>
          <Row>
            <Col><input type="checkbox" name="content" value={el.ID} onChange={this.handleChange} checked={this.state.checked[i]}/></Col>
            <Col>{el.ID}</Col>
            <Col>{el.Names}</Col>
            <Col>{el.Status}</Col>
        </Row>
        </div>          
    )
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;
    var value;

    if(target.value == 'docker'){
      this.setState({content : JSON.parse(JSON.stringify(this.state.data))});
      var arr = []
      for(var idx in this.state.data){
        arr.push(this.state.data[idx].loggingOK == "True" ? true : false);
      }
      this.setState({checked:arr});
    }

    if(target.type == 'checkbox'){
      value = target.checked;
      for(var idx in this.state.content){
        if(this.state.content[idx].ID == target.value){
          this.state.content[idx].loggingOK = value ? "True" : "False";

          let items = [...this.state.checked];
          items[idx] = value;
          this.setState({checked:items});
          break;
        }
      }
    }
    else {
      value = target.value;
      this.setState({
        [name]: value
      });
    }

    console.log(name + ',' + value);
    console.log(this.state);
    this.render();
  }

  handleSubmit(event) {
    console.log(this.state);
    axios.post('http://localhost:4000/locationupdates', this.state.content)
        .then(response => alert(response.data))
        .catch(err => alert(err));
    event.preventDefault();
    this.handleReset();
  }

  handleReset(){
    this.setState({source:'',content:[],checked:[]});
  }

  render() {
    var ReactCSSTransitionGroup = require('react-transition-group'); // ES5 with npm
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
                      <p><Container fluid>{this.print()}</Container></p>
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