import ConnectMongo from "./connectMongo.js";
import { userService } from "./../../users/userService.js";
import dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });
const checkAdmin = async () => {
  const isExistAdmin = await userService.findOne({ roles: "admin" });
  if (isExistAdmin) {
    console.log("Admin is exist on System");
  }
  await userService.create({
    email: "admin123@gmail.com",
    password: "admin",
    roles: "admin",
  });
  console.log("Admin is added");
};
ConnectMongo.getConnect();
checkAdmin();
