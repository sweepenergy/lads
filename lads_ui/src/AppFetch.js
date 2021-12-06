import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import handleChange from './Add.js';

function fuckme(url, divID){
  let request = new XMLHttpRequest();
  request.open('GET', url);
  request.responseType = 'json';
  request.onload = function() {
    //console.log(request.response);
    var json = (request.response);

    var divelement = document.querySelector("#"+divID);
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
  };
  //console.log(request);
  request.send();
}

export default fuckme;