const express = require("express");
const axios = require('axios');
const helmet = require("helmet");
require('dotenv').config()

const app = express();

app.use(helmet());

// AUTH INFO
auth_user_id = process.env.SWEEP_API_ID /// user key from api_keys
auth_token = process.env.SWEEP_API_TOKEN // token from api_keys

function getHomeDirectory() {
    var config = {
        method: 'get',
  	url: 'https://api.sweepapi.com/directory/home',
  	headers: { Authorization: `Bearer ${auth_token}` }
    };

    axios(config)
    .then(function (response) {
  	console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
  	console.log(error);
    });
}

function postDirectory() {
  var axios = require('axios');
  var data = JSON.stringify({
    "name": "Building C",
    "dirtop": ""
  });

  var config = {
    method: 'post',
    url: 'https://api.sweepapi.com/directory',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth_token}`
    },
    data : data
};

  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });
}

function getDirectoryByID() {
  var axios = require('axios');
  // Currently set to home directory id
  var directory_id = "497f225b-7769-4d64-96fb-0ae232eee090"

  var config = {
    method: 'get',
    url: 'https://api.sweepapi.com/directory/' + directory_id,
    headers: { Authorization: `Bearer ${auth_token}` }
  };

  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });
}


getHomeDirectory()
getDirectoryByID()
