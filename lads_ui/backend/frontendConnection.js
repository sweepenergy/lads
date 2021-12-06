require('dotenv').config()
const express = require("express");
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 4000;

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Success! Your application is running on port ${port}.`);
});

app.get('/dockercontainers', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    fs.readFile('containersJSON.json', 'utf8', function(err, data){
        // console.log(data)
        return res.send(JSON.parse(data));
    });
    // return res.send('Received a GET HTTP method on Main page');
});
  
app.post('/locationupdates', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    console.log(req.body);
    // Example Request: 
    // curl -X POST -H "Content-Type: application/json" -d '[{"containerID": "410208af55b7", "loggingOK" : "False"}, {"containerID": "7d19b89aac1d", "loggingOK" : "False"}]' localhost:4000/locationupdates
    // fs.readFile('containersJSON.json', 'utf8', function(err, data){
    //     let containers = JSON.parse(data)
    //     let updates = req.body
    //     for (let resIndex = 0; resIndex < updates.length; resIndex++) {
    //         for (let index = 0; index < containers.length; index++) {
    //             if (containers[index].ID == updates[resIndex].containerID) {
    //                 containers[index].loggingOK = updates[resIndex].loggingOK;
    //             }
    //         }
    //     }
    if(req.body[0] == 'docker'){
        fs.writeFileSync('containersJSON.json', JSON.stringify(req.body[1]), err => {
            if (err) {
              console.log('Error writing file', err)
            } else {
              console.log('Successfully wrote file')
            }
          })
    }
    else{
        console.log('Cassandra log');
    }
    // });
    return res.send('Received a POST HTTP method');
});