import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });
import distance from "google-distance";
import ErrorResponse from "./ErrorResponse.js";
distance.apiKey = process.env.API_KEY;
export const distanceDelivery = new Promise((error, result) => {
  distance.get(
    {
      origin: element.storeAddress,
      destination: deliveryAddress,
    },
    function (err, data) {
      if (err) {
        error(err);
      } else {
        result(data.distanceValue);
      }
    }
  );
}).then((res) => console.log("res", res));
