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
  //console.log(error)
}
}


//checks if directories for Cassandra and Docker are already created
//if not, they will be created here
async function checkDirectories(){
  let home_dir = await getHomeDirectory()
  let home_info = JSON.parse(home_dir)

  //booleans for checking if directories exist, initially false
  let isDocker = false
  let isCassandra = false

  //parse through the directory array tocheck for directories
  for (let i = 0; i < home_info.directory.length; i++){
    if (home_info.directory[i].name == "Cassandra"){
      isCassandra = true
      cassandraID = home_info.directory[i].id
    }
    else if (home_info.directory[i].name == "Docker"){
      isDocker = true
      dockerID = home_info.directory[i].id
    }
  }

  //creates directories here
  if (!isDocker){
    let docker_info = await postDirectory("Docker")
    docker_json = JSON.parse(docker_info)
    dockerID = docker_json.id
  }
  if (!isCassandra){
    let cassandra_info = await postDirectory("Cassandra")
    cassandra_json = JSON.parse(cassandra_info)
    cassandraID = cassandra_json.id
  }
}


// POST Stream from SweepAPI: Creates a stream id
// FIXME: Currently sends data correctly. Need to modify function to return StreamID
async function postStream(id, name) {
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

  try {
    const response = await axios(config);
    return JSON.stringify(response.data)
  } catch (error){
    console.log(error)
  }
}


// POST Stream Dataset from SweepAPI: Takes an array of Timestamp:Data and sends to SweepAPI
function postStreamDataset(stream_id, ts_param_text, containerID) {
  // takes in an array of tuples: [timestamp, data]
  let fileName = containerID + '.txt'
  fs.readFile("running_containers/" + fileName, 'utf8', function(err, data){
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
      // console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
  });
}


// Helper function to create streams for all currently running Docker containers
async function createDockerStreams(directory_id) {
  let containers = JSON.parse(fs.readFileSync('containersJSON.json', 'utf8'));
  let streamToContainers = {}

  for (let index = 0; index < containers.length; index++) {
    // console.log(directory_id);
    // console.log(containers[index].ID);
    streamID = JSON.parse(await postStream(directory_id, containers[index].ID)).id;
    containerID = containers[index].ID
    // streamToContainers[index] = [containerID, streamID];
    streamToContainers[containerID] = streamID
    // console.log(streamToContainers);
  }  
  
  fs.writeFile('streamToContainerIDs.json', JSON.stringify(streamToContainers, null, 2), err => {
    if (err) {
      console.log('Error writing file', err)
    } else {
      // console.log('Successfully wrote file')
    }
  })
}


// Helper function to check which streams are already created, and create those that haven't yet been made
async function checkDockerStreams(directory_id) {
  let containers = JSON.parse(fs.readFileSync('containersJSON.json', 'utf8'));
  let streams = JSON.parse(fs.readFileSync('streamToContainerIDs.json', 'utf8'));
  // console.log(Object.keys(streams))
  let streamToContainers = {}

  for (let index = 0; index < containers.length; index++) {
    // console.log(directory_id);
    // console.log(containers[index].ID);
    containerID = containers[index].ID
    if (streams.hasOwnProperty(containerID)) {
      streamID = streams[containerID]
      // console.log(containerID + "Found in streams")
    } else {
      streamID = JSON.parse(await postStream(directory_id, containerID)).id;
    }
    // streamToContainers[index] = [containerID, streamID];
    streamToContainers[containerID] = streamID
    // streamToContainers[containers[index].ID] = JSON.parse(streamID).id
    // console.log(streamToContainers);
  }  
  
  fs.writeFile('streamToContainerIDs.json', JSON.stringify(streamToContainers, null, 2), err => {
    if (err) {
      console.log('Error writing file', err)
    } else {
      // console.log('Successfully wrote file')
    }
  })
}


// Runs shell command docker ps to get list of all currently running Docker containers
// Outputs results to containersJSON.json
async function getDockerID() {
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
    // console.log(containers.length);
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


// Gets Cassandra Logs and outputs to cassandra_logs.txt
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


// Sends all Cocker container logs to SweepAPI
function sendDockerLogs() {
  fs.readFile('streamToContainerIDs.json', 'utf8', function(err, data){
    let streamToContainers = JSON.parse(data)
    let containerIDs = Object.keys(streamToContainers)
    // console.log(numOfContainers)
    for (let index = 0; index < containerIDs.length; index++) {
      containerID = containerIDs[index]
      streamID = streamToContainers[containerID]
      // console.log(streamID)
      // console.log(containerID)
      postStreamDataset(streamID, "log_maintenance", containerID)
    }
  });
}


// Sends all Cassandra logs to SweepAPI
function sendCassandraLogs() {
  return 1
}

// made main function an async function
// basically if we want to do the same for every other function
// we follow the format as such
async function main() {
  console.log("Starting Server and Docker Log Monitoring:");
  
  // Step 1: Check if Cassandra and Docker directories have been created yet, and make it not
  // Store Directory IDs in two glodal variabels dockerID and cassandraID
  console.log("Checking for Cassandra and Docker Directories");
  await checkDirectories()
  // console.log(cassandraID)
  // console.log(dockerID)

  // Step 2: Get list of currently running Docker containers. Output to containersJSON.json
  console.log("Getting Running Docker Containers");
  await getDockerID();

  // Step 3: Create streams for every running Docker container if not yet created
  // Store streamID in file streamToContainerIDs.txt that associates stream ID with its Docker container ID
  console.log("Creating Docker Container Streams");
  await createDockerStreams(dockerID)
  // console.log(streamToContainers)

  // Runs every 2 minutes. Gets updated Containers, Gets updated Logs, and Sends to SweepAPI
  var minutes = 1, the_interval = minutes * 60 * 1000;
  setInterval(async () => {
    console.log("running")
    // Step 4: Get list of currently running Docker containers. Output to containersJSON.json
    console.log("Getting Running Docker Containers");
    await getDockerID();

    // Step 3: Create streams for every running Docker container if not yet created
    // Store streamID in file streamToContainerIDs.txt that associates stream ID with its Docker container ID
    console.log("Checking for Docker Container Streams");
    await checkDockerStreams(dockerID)

    // Step 5: Runs after Cassandra and Docker Directories are created, and streams are made for all Docker Containers
    // Goes through each docker container and writes ouput to {container}.txt. where {container} is the ID for one container
    console.log("Getting Docker Container Logs");
    getDockerLogs();
    // Goes to Cassandra location and pulls logs to store in {{ FIXME }}
    console.log("Getting Cassandra Logs");
    //getCassandraLogs()

    // Step 6: Send log data to SweepAPI
    console.log("Sending Docker Container Logs to SweepAPI");
    sendDockerLogs()
    console.log("Sending Cassandra Logs to SweepAPI");
    //sendCassandraLogs()
  }, the_interval);
}

main().catch(console.log)