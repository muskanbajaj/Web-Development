const express = require("express");
const https = require("https");
const apiKey = require("./keys").apiKey;
const bodyParser = require("body-parser");


const app = express();
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
  res.sendFile(__dirname + "/index.html")
});

app.post("/",function(req , res){
  const query =req.body.cityName;
  const appKey = apiKey;
  const units = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q="+ query +"&units="+ units +"&appid=" + appKey;
  https.get(url , function(response){
    response.on("data",function(data){
      const weatherData = JSON.parse(data);
      const temperature = weatherData.main.temp;
      const desc = weatherData.weather[0].description;
      const iconID = weatherData.weather[0].icon;
      const iconUrl = "http://openweathermap.org/img/wn/"+ iconID +"@2x.png";
      res.write("<p> The weather is Currently " + desc + "</p>");
      res.write("<h1>The temperature in "+ query +" is " + temperature + " degree celsius.</h1>");
      res.write("<img src ='" +iconUrl +"' >");
      res.send();

    });

  });
});

app.listen(3000, function(){
  console.log("server ie running at port 3000.");
});
