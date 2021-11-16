const express = require("express");
const axios = require('axios');
const helmet = require("helmet");
const { exec } = require("child_process");
const { stdout } = require("process");
require('dotenv').config()

const app = express();

app.use(helmet());

// AUTH INFO
auth_user_id = process.env.SWEEP_API_ID /// user key from api_keys
auth_token = process.env.SWEEP_API_TOKEN // token from api_keys

// Runs a shell command, currently runs docker ps and outputs to console in JSON format
function execCommand(command, callback) {
  exec(command, function (error, stdout, stderr) {
    if (error) {
        callback(stderr);
    }
    else { callback(stdout); }
  });
}

//Takes in a RFC 3339 timestamp and conver it to ISO 
function RFCToISO(logline) {
  //let logLine = new Date("2021-11-15T23:51:31.492743800Z");
  let rfcStr = Date(logLine.split(" ")[0]);
  let isoStr = logLine.toISOString();
  console.log(isoStr);

}
//Runs shell command docker ps and docker logs to 
function getDockerLogID() {
  execCommand("docker ps --format '{\"ID\":\"{{ .ID }}\", \"Image\": \"{{ .Image }}\", \"Names\":\"{{ .Names }}\"}'", function(result) {
    var temp = result.split("\n");
    var containerList = [];
    for (var i=0; i < temp.length - 1; i++) {
      containerList[i] = JSON.parse(temp[i]);
      console.log(containerList[i]);
    }
    
    for (var i=0; i < containerList.length; i++) {
      let id = containerList[i].ID;
      execCommand("docker logs -t " + id, function(result) {
      //execCommand("docker logs -t " + id + " > " + id + ".txt", function(result) {
        console.log("Container Log " + id + ":\n" + result)
      });
    }
  });
}
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

  curr_directory = ID
  if (ID == ""){
    curr_directory = "home"
  }

  var config = {
    method: 'post',
    url: 'https://api.sweepapi.com/directory/' + curr_directory,
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
function postStream(id, name) {
  var data_name = '"' + name + '"'
  var data_id = '"' + id + '"'
  var data = '{\n    "directory_id": ' + data_id + ',\n    "name": ' + data_name + ',\n    "ts": []\n}';

  var config = {
    method: 'post',
    url: 'https://api.sweepapi.com/directory/' + id + '/stream',
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
function postStreamDataset(stream_id, ts_param_text, ts) {
  // takes in an array of tuples: [timestamp, data]
  var data = JSON.stringify([
    [
      "",
      "hello"
    ],
    [
      "",
      "world"
    ],
    [
      "",
      "I'm"
    ],
    [
      "",
      "here"
    ]
  ]);
  
  var config = {
    method: 'post',
    url: 'https://api.sweepapi.com/stream/' + stream_id + '/ts/ ' + ts_param_text + '/dataset',
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

// .then function for getHomeDirectory
getHomeDirectory().then(response => {
  directory_info_home = response;
  //console.log(temp)
});

// .then function for getDirectoryByID
// getDirectoryByID().then(response => {
//   directory_info_by_id = response;
//   //console.log(temp)
// });


// made main function an async function
// basically if we want to do the same for every other function
// we follow the format as such
async function main() {
  // let home_info = await getHomeDirectory()
  // let home_info_id = JSON.parse(home_info).directory[0].id
  // postStream(home_info_id, "tempName1312")
  //RFCToISO();
  getDockerLogID();
  //execCommand();
  //console.log(home_Directory)
  //console.log(temp)
}

main().catch(console.log)