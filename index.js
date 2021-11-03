const express = require("express");
const axios = require('axios');
const helmet = require("helmet");
require('dotenv').config()

const app = express();

app.use(helmet());

// AUTH INFO
auth_user_id = process.env.SWEEP_API_ID /// user key from api_keys
auth_token = process.env.SWEEP_API_TOKEN // token from api_keys

var config = {
  method: 'get',
  url: 'https://api.sweepapi.com/directory/home',
  headers: { Authorization: `Bearer ${auth_token}` }
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});
