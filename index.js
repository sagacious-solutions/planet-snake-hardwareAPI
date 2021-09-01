require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT;
const cors = require("cors");

//console.log(process.env.PORT)

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////// LCD DISPLAY DISABLED HERE ////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////// Setup of ds18b20 sensors
const refreshRate = 10000; // In milliseconds
const dbSaveInterval = 3; // In minutes
const lightingControl = require("./src/control_modules/onOff_vivariumLighting");
const { toggleDayNight } = lightingControl();
const { basking, hide, cool } = require("./src/heating_configuration");

const { readSensorData } = require("./src/sensors/sht30index");

const seconds = 1000;

// setInterval(readSensorData, 15000)

// CHANGE LOGIC TO REDUCE HEATING TO 25c AT NIGHT

app.get("/current", cors(), (req, res) => {
  const currentReadings = {
    baskingCurrent: basking.currentTemp,
    hideCurrent: hide.currentTemp,
    coolCurrent: cool.currentTemp,
  };

  console.log("request made for current readings");
  res.json(currentReadings);
  // res.send(basking.currentTemp);
});

app.get("/targetconfig", cors(), (req, res) => {
  const targetConfig = {
    baskingCurrent: basking.targetTemp,
    hideCurrent: hide.targetTemp,
  };

  res.json(targetConfig);
});

app.put("/targetconfig", cors(), (req, res) => {
  console.log("Someone is trying to update the target config");
  console.log(req);
});

// // increase basking temps
// app.get("/baskingtargetup", cors(), (req, res) => {
//   res.status(200).send(basking.targetTemp);
// });

app.get("/toggledaynight", cors(), (req, res) => {
  console.log("Toggle Day Night Ran command from server");
  res.status(200).send(toggleDayNight());
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// Sets lcd display to refresh once a minute and passes heating controller to lcd_display
//setInterval(lcd_display.displayTemperatures, 60 * seconds, basking, hide, cool);

// process.on("SIGINT" || "exit", function () {
//   console.log("Sunny house is gracefully shutting down");
//   console.log("This code from index.js");
//   process.exit();
// });
