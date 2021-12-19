const express = require("express");
const axios = require('axios');
const helmet = require("helmet");
const { exec } = require("child_process");
const { stdout, exit } = require("process");
const fs = require('fs');
const { ok } = require("assert");
const e = require("express");
require('dotenv').config()

const app = express();

app.use(helmet());

// AUTH INFO
auth_user_id = process.env.SWEEP_API_ID /// user key from api_keys
auth_token = process.env.SWEEP_API_TOKEN // token from api_keys

let dockerDirectoryID = "";
let cassandraDirectoryID = "";
let cassandraStreamID = "";

let streamToContainers = {};

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
async function verifyUser(){
  var config = {
    method: 'get',
    url: 'https://api.sweepapi.com/account/verify_auth',
    headers: { Authorization: `Bearer ${auth_token}` }
  };
  
  try {
    const response = await axios(config);
    return response.status //JSON.stringify(response.data)
  } catch (error){
    console.log(error)
  } 
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
      cassandraDirectoryID = home_info.directory[i].id
    }
    else if (home_info.directory[i].name == "Docker"){
      isDocker = true
      dockerDirectoryID = home_info.directory[i].id
    }
  }

  //creates directories here
  if (!isDocker){
    let docker_info = await postDirectory("Docker")
    docker_json = JSON.parse(docker_info)
    dockerDirectoryID = docker_json.id
  }
  if (!isCassandra){
    let cassandra_info = await postDirectory("Cassandra")
    cassandra_json = JSON.parse(cassandra_info)
    cassandraDirectoryID = cassandra_json.id
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
function postStreamDataset(stream_id, ts_param_text, containerID, fileName) {
  // takes in an array of tuples: [timestamp, data]
  fs.readFile(fileName, 'utf8', function(err, data){
    var config = {
      method: 'post',
      url: 'https://api.sweepapi.com/stream/' + stream_id + '/ts/' + ts_param_text + '/dataset',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth_token}`
      },
      data : data
    };
    // console.log(data);
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
  // Gets list of streams currently in Docker Directory on Facility Ops
  let streams = JSON.parse(await getDirectoryByID(directory_id)).stream;
  // console.log(streams);

  // Store stream IDs and Container IDs in an key:value array
  for (let index = 0; index < streams.length; index++) {
    // console.log(streams[index].name + " " + streams[index].id)
    streamToContainers[streams[index].name] = streams[index].id
  }
  // console.log(streamToContainers);

  // Check containersJSON file for any new containers that need a stream
  let containers = JSON.parse(fs.readFileSync('containersJSON.json', 'utf8'))
  let temp = fs.readFileSync('streamToContainerIDs.json', 'utf8')
  streamsJSON = {}
  if (temp != "") {
    let streamsJSON = JSON.parse(fs.readFileSync('streamToContainerIDs.json', 'utf8'))
  }

  for (let index = 0; index < containers.length; index++) {
    containerID = containers[index].ID;

    if (!(streamToContainers.hasOwnProperty(containerID)) && !(streamsJSON.hasOwnProperty(containerID))) {
      streamID = JSON.parse(await postStream(directory_id, containerID)).id;
      streamToContainers[containerID] = streamID;
      // console.log(containerID + " " + streamToContainers[containerID])
    }
  }  
  
  // Write newest streams to streamToContainerIDs.json
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
  // Check containersJSON file for any new containers that need a stream
  let containers = JSON.parse(fs.readFileSync('containersJSON.json', 'utf8'))

  for (let index = 0; index < containers.length; index++) {
    containersID = containers[index].ID;

    if (!(streamToContainers.hasOwnProperty(containersID))) {
      console.log("StreamToContainers didn't have containerID: " + containerID)
      streamID = JSON.parse(await postStream(directory_id, containerID)).id;
      streamToContainers[containersID] = streamID;
    }
  }  
  
  // Write newest streams to streamToContainerIDs.json
  fs.writeFileSync('streamToContainerIDs.json', JSON.stringify(streamToContainers, null, 2), err => {
    if (err) {
      console.log('Error writing file', err)
    } else {
      // console.log('Successfully wrote file')
    }
  })
}


// Helper function to create Stream for sending Cassandra logs
async function createCassandraStream(directory_id) {
  if (cassandraStreamID == "") {
    let streams = JSON.parse(await getDirectoryByID(directory_id)).stream;
    if (streams.length == 0) {
      cassandraStreamID = JSON.parse(await postStream(directory_id, "cassandra")).id;
    } else {
      cassandraStreamID = streams[0].id
    }
  }
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

    //this will run if containersJSON.json does not exist, meaning that it is the first run of the program
    if (!fs.existsSync('containersJSON.json')){
      var containerJSONArr = JSON.stringify(containerList, null, 2);
      //Creates .json with containers' information
      fs.writeFileSync('containersJSON.json', containerJSONArr, err => {
        if (err) {
          console.log('Error writing file', err)
        } else {
          console.log('Successfully wrote file')
        }
      })
    } 

    //this will run if we find that there is already something in containersJSON.json
    //to prevent us from setting loggingOK to true for all currently running containers, we update their value here
    else {
      fs.readFile('containersJSON.json', 'utf8', function(err, data){
        var confirmedContainers = JSON.parse(data);

        //here, we go through containerList and compare it with our actual file
        //once we find a loggingOK == 'False', we update its value accordingly in containerList
        for (var i = 0; i < confirmedContainers.length; i++){
          for (var j = 0; j < containerList.length; j++){
            if (containerList[j].ID == confirmedContainers[i].ID && confirmedContainers[i].loggingOK == 'False'){
              containerList[j].loggingOK = 'False'
            }
          }
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
      })
    }
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
      var log = "";
      for (var i = 0; i< logString.length-1; i++) {
        //console.log(logString[i].split(" ").slice(2, 4).join('T').replace(',', '.').concat('', 'Z'))
        //let isoStr = new Date(logString[i].split(" ").slice(2, 4)).toISOString();
        let isoStr = new Date(logString[i].split(" ").slice(2, 4).join('T').replace(',', '.').concat('', 'Z'));
        //console.log(isoStr)
        if (!isNaN(isoStr.getTime())) {
          log = logString[i];
          var streamData = [isoStr, log];
          streamPackage.push(streamData);
          log = "";
        }
        else {
          log = log + " " + logString[i];
        }
      }

      fs.writeFileSync('running_cassandra/cassandra_logs.txt', JSON.stringify(streamPackage, null, 2), err => {
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
      let fileName = "running_containers/" + containerID + '.txt'
      postStreamDataset(streamID, "log_maintenance", containerID, fileName)
    }
  });
}

// function checks if the running_containers folder exists
// if not, the function will create the containers folder
function checkContainersFolder(){
  const dir = './running_containers'
  if (!fs.existsSync(dir)){
    fs.mkdirSync('running_containers');
  } else {
    console.log('running_containers exists.')
  }
}

// function checks if the running_cassandra folder exists
// if not, the function will create the cassandra folder
function checkCassandraFolder(){
  const dir = './running_cassandra'
  if (!fs.existsSync(dir)){
    fs.mkdirSync('running_cassandra');
  } else {
    console.log('running_cassandra exists.')
  }
}

// Sends all Cassandra logs to SweepAPI
function sendCassandraLogs() {
  let fileName = "running_cassandra/cassandra_logs.txt"
  postStreamDataset(cassandraStreamID, "log_maintenance", "cassandra", fileName)
}

async function getAndSend() {
  console.log("running")
    // Step 5: Get list of currently running Docker containers. Output to containersJSON.json
    console.log("Getting Running Docker Containers");
    await getDockerID();

    // Step 6: Create streams for every running Docker container if not yet created
    // Store streamID in file streamToContainerIDs.txt that associates stream ID with its Docker container ID
    console.log("Checking for Docker Container Streams");
    await checkDockerStreams(dockerDirectoryID)

    // Step 7: Create stream for Cassandra directory if not yet created
    // Store streamID in global variable cassandraStreamID 
    console.log("Checking for Cassandra Stream");
    await createCassandraStream(cassandraDirectoryID)

    // Step 8: Runs after Cassandra and Docker Directories are created, and streams are made for all Docker Containers
    // Goes through each docker container and writes ouput to {container}.txt. where {container} is the ID for one container
    console.log("Getting Docker Container Logs");
    getDockerLogs();
    // Goes to Cassandra location and pulls logs to store in cassandra_logs.txt
    console.log("Getting Cassandra Logs");
    // getCassandraLogs();
    
    // Step 9: Send log data to SweepAPI
    console.log("Sending Docker Container Logs to SweepAPI");
    sendDockerLogs();
    console.log("Sending Cassandra Logs to SweepAPI");
    // sendCassandraLogs();
}

// made main function an async function
// basically if we want to do the same for every other function
// we follow the format as such
async function main() {
  //getCassandraLogs();

  let isAuthenticated = await verifyUser();
  
  if (isAuthenticated != 200) {
    console.log("User Not Authenticated. Please update Bearer Token and try again.")
    exit(0)
  }
  console.log("User Authenticated.")
  console.log("Starting Server and Docker Log Monitoring:");
  
  checkContainersFolder();
  checkCassandraFolder();

  // Step 1: Check if Cassandra and Docker directories have been created yet, and make it not
  // Store Directory IDs in two glodal variabels dockerDirectoryID and cassandraDirectoryID
  
  console.log("Checking for Cassandra and Docker Directories");
  await checkDirectories()
  // console.log(cassandraDirectoryID)
  // console.log(dockerDirectoryID)

  // Step 2: Get list of currently running Docker containers. Output to containersJSON.json
  console.log("Getting Running Docker Containers");
  await getDockerID();


  // Step 3: Create streams for every running Docker container if not yet created
  // Store streamID in file streamToContainerIDs.txt that associates stream ID with its Docker container ID
  console.log("Creating Docker Container Streams");
  await createDockerStreams(dockerDirectoryID)

  // Step 4: Create stream for Cassandra logs, only need one
  // Store streamID in global variable cassandraStreamID 
  console.log("Creating Cassandra Stream");
  await createCassandraStream(cassandraDirectoryID)

  await getAndSend();
  // Runs every 2 minutes. Gets updated Containers, Gets updated Logs, and Sends to SweepAPI
  var minutes = 1, the_interval = minutes * 60 * 1000;
  setInterval(async () => {
    await getAndSend();
  }, 10000);
}

main().catch(console.log)