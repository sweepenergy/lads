const express = require("express");
const axios = require('axios');
const helmet = require("helmet");
const { exec } = require("child_process");
const { stdout } = require("process");
const fs = require('fs');
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

//Runs shell command docker ps and docker logs to 
function getDockerLogID() {
  //Outputs Containers' info and formats it into JSON object
  execCommand("docker ps --format '{\"ID\":\"{{ .ID }}\", \"Image\": \"{{ .Image }}\", \"Names\":\"{{ .Names }}\", \"Status\": \"{{ .Status }}\"}'", function(result) {
    var temp = result.split("\n");
    var containerList = [];
    for (var i=0; i < temp.length - 1; i++) {
      containerList[i] = JSON.parse(temp[i]);
    }
    var containerJSONArr = JSON.stringify(containerList, null, 2);
    //Creates .json with containers' information
    fs.writeFile('containersJSON.json', containerJSONArr, err => {
      if (err) {
        console.log('Error writing file', err)
      } else {
        console.log('Successfully wrote file')
      }
    })
    //Iterates through containers' list to grab logs
    for (var i=0; i < containerList.length; i++) {
      let id = containerList[i].ID;
      execCommand("docker logs -t " + id, function(result) {
        var streamPackage = [];
        var logString = result.split("\n");
        //console.log(id + ":");
        for (var j=0; j < logString.length-1; j++) {
          //Grabs the RFC timestamp and converts it to ISO
          let isoStr = new Date(logString[j].split(" ")[0]).toISOString();
          //Grabs the rest of the data 
          let logLine = logString[j].substr(logString[j].indexOf(" ") + 1);
          //Packages it into a tuple
          var streamData = [isoStr, logLine];
          streamPackage[j] = streamData;
        }
        //Writes Stream Package into a .txt file
        fs.writeFile(id + '.txt', JSON.stringify(streamPackage, null, 2), err => {
          if (err) {
            console.log('Error writing file', err)
          } else {
            console.log('Successfully wrote file')
          }
        })
      });
    }
  });
}

function getCassandraLogs() {

}

// Verifies if the user is authenticated, returns a status code of 200 if so
function verifyUser(){
  var config = {
    method: 'get',
    url: 'https://api.sweepapi.com/account/verify_auth',
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
  var data = '{\n    "directory_id": ' + data_id + ',\n    "name": ' + data_name + ',\n    "ts": [{"id": "log_maintenance","name": "Maintenance Log","description": "Maintenance Log over time","unit": "unitless","type": "text"}]\n}';

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
function postStreamDataset(stream_id, ts_param_text) {
  // takes in an array of tuples: [timestamp, data]
  fs.readFile('4812b7648ab6.txt', 'utf8', function(err, data){
    console.log(data)
    new_data = JSON.stringify(data)
    var config = {
      method: 'post',
      url: 'https://api.sweepapi.com/stream/' + stream_id + '/ts/ ' + ts_param_text + '/dataset',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth_token}`
      },
      data : new_data
    };
    
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
  });
  // var data = JSON.stringify([
  //   [
  //     "",
  //     "hello"
  //   ],
  //   [
  //     "",
  //     "world"
  //   ],
  //   [
  //     "",
  //     "I'm"
  //   ],
  //   [
  //     "",
  //     "here"
  //   ]
  // ]);
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
  // postStream(home_info_id, "tempName1500")
  // getDockerLogID();
  postStreamDataset("14fa3498-4cc0-45c1-b5e1-a026ecc7e9ea","log_maintenance")
  //execCommand();
  //console.log(home_Directory)
  //console.log(temp)
}

main().catch(console.log)