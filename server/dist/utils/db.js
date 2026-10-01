"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../config"));
const dbUrl = config_1.default.DB_URL || "";
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(dbUrl).then((data) => {
            console.log(`Database connected with ${data.connection.host}`);
        });
    }
    catch (error) {
        console.log(error.message);
        setTimeout(connectDB, 5000);
    }
};
exports.default = connectDB;
// import mongoose from "mongoose";
// import config from "../config";
// import type { ConnectOptions } from "mongoose";
// const dbUrl: string = config.DB_URL || "";
// const clientOptions: ConnectOptions = {
//   dbName: "NGECP_DB",
//   appName: "NGECP",
//   serverApi: {
//     version: "1",
//     strict: true,
//     deprecationErrors: true,
//   },
// };
// const connectDB = async () => {
//   try {
//     await mongoose.connect(dbUrl, clientOptions).then((data: any) => {
//       console.log(`Database connected with ${data.connection.host}`);
//     });
//   } catch (error: any) {
//     console.log(error.message);
//     setTimeout(connectDB, 5000);
//   }
// };
// export default connectDB;
