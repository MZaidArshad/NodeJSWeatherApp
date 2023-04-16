const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceValue = (tempValue, orgVal) => {
  let temperature = tempValue.replace("{%tempVal%}", orgVal.main.temp);
  temperature = temperature.replace("{%minTemp%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%maxTemp%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%city%}", orgVal.name);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather.main);
  return temperature;
};

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?lat=31.45&lon=73.13&appid=44de96bdc9cee720720aabff235edccf"
    )
      .on("data", (chunk) => {
        let objData = JSON.parse(chunk);
        let arrData = [objData];
        const realTimeData = arrData.map((val) => replaceValue(homeFile, val));
        const responseString = realTimeData.join("");
        res.write(responseString);
        res.end();
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        console.log("end");
      });
  }
});

server.listen("8000", "127.0.0.1");
