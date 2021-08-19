import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
class ConnectMongo {
  constructor() {
    this.gfs = null;
  }
  static getConnect() {
    mongoose
      .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true,
      })
      .then(() => console.log("DB is connected"))
      .catch((err) => console.log("DB connect err " + err));
    const conn = mongoose.connection;
    conn.once("open", () => {
      console.log("DB is connected");
      this.gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "uploads",
      });
    });
  }
}
export default ConnectMongo;
