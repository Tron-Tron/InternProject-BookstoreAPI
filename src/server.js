import dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });
//
ConnectMongo.getConnect();
import express from "express";
import cors from "cors";
import morganBody from "morgan-body";

import ConnectMongo from "./components/commons/database/connectMongo.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import root from "./routes/root.js";

const app = express();
app.use(express.json());

// middleware
app.use(cors());

if (process.env.NODE_ENV === "development") {
  morganBody(app);
}

app.use("/api", root);

app.use(errorMiddleware);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running in port ${PORT}`);
});
export default app;
