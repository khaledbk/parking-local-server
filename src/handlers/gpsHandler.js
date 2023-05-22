import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";

const gps_path = process.env.GPS_SERIAL_PORT || "COM6";

const port = new SerialPort({ path: gps_path, baudRate: 57600 });
const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

export let latestCoordinates = {
  latitude: 0,
  longitude: 0,
};

const convertToDecimalDegrees = (value) => {
  const degrees = Math.floor(value / 100);
  const minutes = value % 100;
  return degrees + minutes / 60;
};

export const startGpsParser = () => {
  let ggaLatitude;
  let ggaLongitude;
  let rmcLatitude;
  let rmcLongitude;
  let ggaLatitudeSign;
  let ggaLongitudeSign;
  let rmcLatitudeSign;
  let rmcLongitudeSign;

  // Handle error event
  port.on("error", (error) => {
    console.error("Serial port error:", "No GPS module found!");
    // Perform error handling here, such as logging the error or taking appropriate actions
  });

  parser.on("data", (data) => {
    // Check if the data contains GPS information
    if (data.startsWith("$GNRMC") || data.startsWith("$GNGGA")) {
      // Split the data into individual GPS values
      const values = data.split(",");

      // Check if the message type is GGA and if it contains valid latitude and longitude data
      if (data.startsWith("$GNGGA") && values[2] !== "" && values[4] !== "") {
        // Extract the latitude and longitude from the values
        ggaLatitude = parseFloat(values[2]);
        ggaLongitude = parseFloat(values[4]);
        ggaLatitudeSign = values[3] === "N" ? 1 : -1;
        ggaLongitudeSign = values[5] === "E" ? 1 : -1;

        // Check if the latitude and longitude are valid numbers
        if (!isNaN(ggaLatitude) && !isNaN(ggaLongitude)) {
          // Convert latitude and longitude to decimal degrees
          ggaLatitude = convertToDecimalDegrees(ggaLatitude) * ggaLatitudeSign;
          ggaLongitude =
            convertToDecimalDegrees(ggaLongitude) * ggaLongitudeSign;

          /*           console.log(
            `GGA: Latitude: ${ggaLatitude}, Longitude: ${ggaLongitude}`
          ); */
        }
      }
      // Check if the message type is RMC and if it contains valid latitude and longitude data
      if (data.startsWith("$GNRMC") && values[3] !== "" && values[5] !== "") {
        // Extract the latitude and longitude from the values
        rmcLatitude = parseFloat(values[3]);
        rmcLongitude = parseFloat(values[5]);
        rmcLatitudeSign = values[4] === "N" ? 1 : -1;
        rmcLongitudeSign = values[6] === "E" ? 1 : -1;

        // Check if the latitude and longitude are valid numbers
        if (!isNaN(rmcLatitude) && !isNaN(rmcLongitude)) {
          // Convert latitude and longitude to decimal degrees
          rmcLatitude = convertToDecimalDegrees(rmcLatitude) * rmcLatitudeSign;
          rmcLongitude =
            convertToDecimalDegrees(rmcLongitude) * rmcLongitudeSign;

          /*           console.log(
            `RMC: Latitude: ${rmcLatitude}, Longitude: ${rmcLongitude}`
          ); */
        }
      }

      // Calculate the average latitude and longitude values and assign them to latestCoordinates
      if (
        ggaLatitude !== undefined &&
        ggaLongitude !== undefined &&
        rmcLatitude !== undefined &&
        rmcLongitude !== undefined
      ) {
        const latitude = (ggaLatitude + rmcLatitude) / 2;
        const longitude = (ggaLongitude + rmcLongitude) / 2;
        latestCoordinates = { latitude, longitude };

        /* console.log(`GPS: Latitude: ${latitude}, Longitude: ${longitude}`); */
      }
    }
  });
};
