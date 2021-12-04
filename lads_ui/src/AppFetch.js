import React, {useReducer, useState} from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function fuckme(url, divID){
  let request = new XMLHttpRequest();
  request.open('GET', url);
  request.responseType = 'json';
  request.onload = function() {
    console.log(request.response);
    var json = (request.response);

    var element = document.querySelector("#"+divID);
    element.innerHTML = "";
    console.log(json);
    for(var key = 0; key < json.length; key++){
      console.log(json[key]);
      element.innerHTML += '<label>'
      let p = '<div class="row"><div class="col"><input type="checkbox" name=' + json[key].ID + ' onChange={handleChange} id="container"/></div><div class="col">'+json[key].ID+'</div><div class="col">'+json[key].Names+'</div><div class="col">'+json[key].Status+'</div></div>';
      console.log(p);
      element.innerHTML += (p);
      element.innerHTML += '<\label>'
    }
  };
  console.log(request);
  request.send();
}

export default fuckme;