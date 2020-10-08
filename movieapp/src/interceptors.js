//var axios = require("axios");
import axios from 'axios';

//const jwtToken = sessionStorage.getItem("authorization");

axios.interceptors.request.use(
  function(config) {
    const jwtToken = sessionStorage.getItem("authorization");
    if (jwtToken) {
      //console.log("Hello");
      config.headers.authorization = "Bearer " + jwtToken;
     }
    return config;
  },
  function(err) {
    return Promise.reject(err);
  }
);

