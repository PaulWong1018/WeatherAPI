const { response } = require("express");
const express = require("express");
const app = express();
const https = require("https");

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  //data from our local server
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {

  const query = req.body.cityName;
  const apiKey = "da58a0ef919ff7d87d6fcd25a4a671df";
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

  console.log(url);

  https.get(url, function (response) {
    //data from external server
    console.log(response.statusCode);

    response.on("data", function (data) {
      //when receive data , log data
      const weatherData = JSON.parse(data); //transform the data into Javascript
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const weatherReport = query + "'s temperature is " + temp + " degrees. ";
      const iconUrl = "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png";
      console.log(iconUrl);

      res.write("<h1>" + weatherReport + "</h1>");
      res.write( "<h2>The weather is currently " + weatherDescription + ".</h2>" );
      res.write("<img src= " + iconUrl + ">");
      //res.write can use many times
      res.send(); //res.send can only send 1
    });
  });
});

app.listen(3000, function () {
  console.log("Server is running on port 3000.");
});
