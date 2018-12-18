import path from "path";
import {httpCodes} from "./httpCodes";
import {routes} from "./routes";

export const constants = {
    isProduction: process.env.NODE_ENV === "production",
    isDevelopment: process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test",
    isTest: process.env.NODE_ENV === "test",
    serverRoot: path.normalize(__dirname + "/../.."),
    routes,
    httpCodes,
};