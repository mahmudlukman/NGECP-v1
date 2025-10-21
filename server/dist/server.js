"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const config_1 = __importDefault(require("./config"));
const db_1 = __importDefault(require("./utils/db"));
// import { v2 as cloudinary } from "cloudinary";
// cloudinary config
// cloudinary.config({
//   cloud_name: config.CLOUDINARY_CLOUD_NAME,
//   api_key: config.CLOUDINARY_API_KEY,
//   api_secret: config.CLOUDINARY_API_SECRET,
// });
// create server
app_1.app.listen(config_1.default.PORT, () => {
    console.log(`Server is connected with port ${config_1.default.PORT}`);
    (0, db_1.default)();
});
