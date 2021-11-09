const express = require("express");
const axios = require('axios');
const helmet = require("helmet");
require('dotenv').config()

const app = express();

app.use(helmet());

// AUTH INFO
auth_user_id = process.env.SWEEP_API_ID /// user key from api_keys
auth_token = process.env.SWEEP_API_TOKEN // token from api_keys

// GET Home Directory from SweepAPI: Returns a JSON object with home directory information, most importantly is ID
async function getHomeDirectory() {
    var config = {
      method: 'get',
  	  url: 'https://api.sweepapi.com/directory/home',
  	  headers: { Authorization: `Bearer ${auth_token}` }
    };

    try {
      const response = await axios(config);
      return JSON.stringify(response.data)
    } catch (error){
      console.log(error)
    } 
}
  
// POST Create Directory from SweepAPI: Takes a directory name and returns a new directory
//If ID is empty, the directory is created in home
function postDirectory(name, ID = "") {
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

// GET Directory Given ID from SweepAPI: Takes a directory ID, and returns a directory name
async function getDirectoryByID(directory_id) {
  // Currently set to home directory id
  // directory_id = "497f225b-7769-4d64-96fb-0ae232eee090"

  var config = {
    method: 'get',
    url: 'https://api.sweepapi.com/directory/' + directory_id,
    headers: { Authorization: `Bearer ${auth_token}` }
  };

  try {
    const response = await axios(config);
    return JSON.stringify(response.data)
  } catch (error){
    console.log(error)
  } 
}

// POST Stream from SweepAPI: Creates a stream id
// FIXME: Currently sends data correctly. Need to modify function to return StreamID
function postStream() {
  var data = '{\n    "directory_id": "b22ca0b7-713e-40e4-a70e-e8cca87bdeba",\n    "name": "docker_4",\n    "ts": [\n        {\n            "id": "voltage_b",\n            "name": "Voltage b",\n            "description": "Voltage b amps",\n            "unit": "volts",\n            "type": "number"\n        },\n        {\n            "id": "current_b",\n            "name": "Current b",\n            "description": "Current b amps",\n            "unit": "amps",\n            "type": "number"\n        },\n        {\n            "id": "log_maintenance",\n            "name": "Maintenance Log",\n            "description": "Maintenance Log over time",\n            "unit": "unitless",\n            "type": "text"\n        }\n    ]\n}';

  var config = {
    method: 'post',
    url: 'https://api.sweepapi.com/directory/' + 'b22ca0b7-713e-40e4-a70e-e8cca87bdeba' + '/stream',
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

// POST Stream Dataset from SweepAPI: Takes an array of Timestamp:Data and sends to SweepAPI
function postStreamDataset() {
  var data = '{\n    "directory_id": "{{directory_id}}",\n    "name": "test stream name",\n    "inputDataVar": [\n        {\n            "var_name": "voltage_b",\n            "display_name": "Voltage b",\n            "description": "Voltage b amps",\n            "units": "volts",\n            "type": "number"\n        },\n        {\n            "var_name": "current_b",\n            "display_name": "Current b",\n            "description": "Current b amps",\n            "units": "amps",\n            "type": "number"\n        },\n        {\n            "var_name": "log_maintenance",\n            "display_name": "Maintenance Log",\n            "description": "Maintenance Log over time",\n            "units": "unitless",\n            "type": "text"\n        }\n    ]\n}';

  var config = {
    method: 'post',
    url: 'https://api.sweepapi.com/stream/' + stream_id + '/ts/' + ts_param_text + '/dataset',
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

// .then function for getHomeDirectory
getHomeDirectory().then(response => {
  directory_info_home = response;
  //console.log(temp)
});

// // .then function for getDirectoryByID
// getDirectoryByID().then(response => {
//   directory_info_by_id = response;
//   //console.log(temp)
// });

// made main function an async function
// basically if we want to do the same for every other function
// we follow the format as such
async function main() {
  home_Directory = await getHomeDirectory()
  console.log(home_Directory)
  console.log(JSON.parse(home_Directory).id)
  postStream()
  //console.log(temp)
}
  
main().catch(console.log)
