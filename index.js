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

    let jsonString = ""

    axios(config)
    .then(function (response) {
  	console.log(JSON.stringify(response.data))
    jsonString = JSON.stringify(response.data);
    })
    .catch(function (error) {
  	console.log(error);
    });

    return jsonString
}

function postDirectory(name, ID = "") {
  var axios = require('axios');
  var data = JSON.stringify({
    "name": name,
    "dirtop": ID
  });

  temp = ID
  if (ID == ""){
    temp = "home"
  }

  var config = {
    method: 'post',
    url: 'https://api.sweepapi.com/directory/' + temp,
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

function getDirectoryByID(directory_id) {
  var axios = require('axios');
  // Currently set to home directory id
  //directory_id = "497f225b-7769-4d64-96fb-0ae232eee090"

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

function postStream() {
  var axios = require('axios');
  var data = '{\n    "directory_id": "{{directory_id}}",\n    "name": "test stream name",\n    "inputDataVar": [\n        {\n            "var_name": "voltage_b",\n            "display_name": "Voltage b",\n            "description": "Voltage b amps",\n            "units": "volts",\n            "type": "number"\n        },\n        {\n            "var_name": "current_b",\n            "display_name": "Current b",\n            "description": "Current b amps",\n            "units": "amps",\n            "type": "number"\n        },\n        {\n            "var_name": "log_maintenance",\n            "display_name": "Maintenance Log",\n            "description": "Maintenance Log over time",\n            "units": "unitless",\n            "type": "text"\n        }\n    ]\n}';

  var config = {
    method: 'post',
    url: 'https://api.sweepapi.com/stream',
    headers: { Authorization: `Bearer ${auth_token}` },
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

homeID = getHomeDirectory().id
//postDirectory("Docker",homeID)
getDirectoryByID(homeID)