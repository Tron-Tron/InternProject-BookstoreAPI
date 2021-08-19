import ConfigDev from "./dev.js";

let config;
if (process.env.NODE_ENV === "production") {
  config = ConfigProd;
} else {
  config = ConfigDev;
}

export default config;
