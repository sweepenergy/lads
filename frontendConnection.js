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
    // Example Request: 
    // curl -X POST -H "Content-Type: application/json" -d '{"container": "alpha", "id": "238C88d3nHD6", "logging-ok" : "false"}' localhost:4000/locationupdates
    console.log(req.body);
    return res.send('Received a POST HTTP method');
});
  
app.put('/', (req, res) => {
    return res.send('Received a PUT HTTP method');
});