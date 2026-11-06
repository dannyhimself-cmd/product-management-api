import { registerAs } from "@nestjs/config";
import { getDatabaseOptions } from "./database-options.js";

//Lấy các thành phần về thuộc tính registerAs cho nestJS xài
export default registerAs('database', getDatabaseOptions);