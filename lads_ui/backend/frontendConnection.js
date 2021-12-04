require('dotenv').config()
const express = require("express");
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 4000;

// Add the bodyParser middelware to the express application
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(port, () => {
  console.log(`Success! Your application is running on port ${port}.`);
});

app.get('/dockercontainers', (req, res) => {
	res.set('Access-Control-Allow-Origin', '*');
    fs.readFile('containersJSON.json', 'utf8', function(err, data){
        // console.log(data)
        return res.send(data);
    });
    // return res.send('Received a GET HTTP method on Main page');
});
  
app.post('/', (req, res) => {
	res.set('Access-Control-Allow-Origin', '*');
    return res.send('Received a POST HTTP method');
});
  
app.put('/', (req, res) => {
    return res.send('Received a PUT HTTP method');
});