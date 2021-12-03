const express = require("express");
const axios = require('axios');
const helmet = require("helmet");
const { exec } = require("child_process");
const { stdout } = require("process");
const fs = require('fs');
const { ok } = require("assert");
require('dotenv').config()

const app = express();

app.use(helmet());

// AUTH INFO
auth_user_id = process.env.SWEEP_API_ID /// user key from api_keys
auth_token = process.env.SWEEP_API_TOKEN // token from api_keys

let dockerID = "";
let cassandraID = "";

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
function getDockerID() {
  //Outputs Containers' info and formats it into JSON object
  execCommand("docker ps --format '{\"ID\":\"{{ .ID }}\", \"Image\": \"{{ .Image }}\", \"Names\":\"{{ .Names }}\", \"Status\": \"{{ .Status }}\", \"loggingOK\": \"True\"}'", function(result) {
    var temp = result.split("\n");
    var containerList = [];
    for (var i=0; i < temp.length - 1; i++) {
      containerList[i] = JSON.parse(temp[i]);
    }
    var containerJSONArr = JSON.stringify(containerList, null, 2);
    //Creates .json with containers' information
    fs.writeFileSync('containersJSON.json', containerJSONArr, err => {
      if (err) {
        console.log('Error writing file', err)
      } else {
        console.log('Successfully wrote file')
      }
    })
    /*
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
        fs.writeFileSync(id + '.txt', JSON.stringify(streamPackage, null, 2), err => {
          if (err) {
            console.log('Error writing file', err)
          } else {
            console.log('Successfully wrote file')
          }
        })
      });
    }
    */
  });
}

// Helper function to iterate through all running containers
// Only logs containers that have "loggingOk" set to True
function getDockerLogs() {
  fs.readFile('containersJSON.json', 'utf8', function(err, data){
    var containers = JSON.parse(data);
    console.log(containers.length);
    for(var index = 0; index < containers.length; index++) {
      if (containers[index].loggingOK == 'True') {
        getDockerLogsByID(containers[index].ID);
      }
    }
  });
}

// Takes a single Container ID and outputs its logs to running_containers directory
function getDockerLogsByID(ID) {
  execCommand("docker logs -t " + ID, function(result) {
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
    fs.writeFileSync('running_containers/' + ID + '.txt', JSON.stringify(streamPackage, null, 2), err => {
      if (err) {
        console.log('Error writing file', err)
      } else {
        console.log('Successfully wrote file')
      }
    })
  });
  
}

function getCassandraLogs(directory="/var/log/cassandra/system.log") {
  execCommand("input = " + directory, function(result) {
    execCommand("while read line; do echo $line; done < " + directory, function(result){
      var streamPackage = [];
      var logString = result.split("\n");
      for (var i = 0; i< logString.length-1; i++) {
        //var words = logString.split(' ');
        let isoStr = new Date(logString[i].split(" ")[2]).toISOString();
        //console.log(isoStr);
        var streamData = [isoStr, logString[i]];
        streamPackage[i] = streamData;
      }

      fs.writeFile('cassandra_logs.txt', JSON.stringify(streamPackage, null, 2), err => {
        if (err) {
          console.log('Error writing file', err)
        } else {
          console.log('Successfully wrote file')
        }
      })
    });
  });
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
async function postDirectory(name, ID = "") {
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

  try {
    const response = await axios(config);
    return JSON.stringify(response.data)
  } catch (error){
    console.log(error)
  }
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
function postStreamDataset(stream_id, ts_param_text, containerID) {
  // takes in an array of tuples: [timestamp, data]
  let fileName = containerID + '.txt'
  fs.readFile(fileName, 'utf8', function(err, data){
    console.log(data)
    var config = {
      method: 'post',
      url: 'https://api.sweepapi.com/stream/' + stream_id + '/ts/' + ts_param_text + '/dataset',
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
  });
}

function createDockerStreams(directory_id) {
  var json = JSON.parse(fs.readFileSync('containersJSON.json', 'utf8'));

  for (let index = 0; index < json.length; index++) {
    postStream(directory_id, json[index].ID)
  }  
}

// function sendDockerLogData(directory_id) {
//   let temp_info = await getDirectoryByID(directory_id)
//   // let temp_info_id = JSON.parse(temp_info)
// }

// .then function for getHomeDirectory
//getHomeDirectory().then(response => {
  //directory_info_home = response;
  //console.log(temp)
//});

// .then function for getDirectoryByID
//getDirectoryByID().then(response => {
  //directory_info_by_id = response;
  //console.log(temp)
//});

async function checkDirectories(){
  let home_dir = await getHomeDirectory()
  let home_info = JSON.parse(home_dir)
  let isDocker = false
  let isCassandra = false
  for (let i = 0; i < home_info.directory.length; i++){
    if (home_info.directory[i] == "Cassandra"){
      isCassandra = true
    }
    else if (home_info.directory[i] == "Docker"){
      isDocker = true
    }
  }

  if (!isDocker){
    let docker_info = await postDirectory("Docker")
    docker_json = JSON.parse(docker_info)
    dockerID = dockerID.id
  }
  if(!isCassandra){
    let cassandra_info = await postDirectory("Cassandra")
    cassandra_json = JSON.parse(cassandra_info)
    cassandraID = cassandra_json.id
  }
}

// made main function an async function
// basically if we want to do the same for every other function
// we follow the format as such
async function main() {
  checkDirectories();

  //getDockerID();
  //getDockerLogs();
  //getCassandraLogs();

  // let home_info = await getHomeDirectory()
  // let home_info_id = JSON.parse(home_info)
  // console.log(home_info_id)

  // let temp_info = await getDirectoryByID(home_info_id.directory[0].id)
  // let temp_info_id = JSON.parse(temp_info)
  // console.log(temp_info_id.stream[0].id)
  // console.log(temp_info_id.stream.length)
  // postStream(home_info_id, "Docker")

  // createDockerStreams(home_info_id.directory[0].id);

  // postStreamDataset("0f13a9ce-fbe7-4cf4-8e46-cbccf8ced5ef","log_maintenance", "29f67257d4e2")
  //execCommand();
  //console.log(home_Directory)
  //console.log(temp)
}

main().catch(console.log)