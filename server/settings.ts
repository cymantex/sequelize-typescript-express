import {constants} from "./utils/constants";
import {SequelizeConfig} from "sequelize-typescript/lib/types/SequelizeConfig";
import {Sequelize} from "sequelize-typescript";
import {ServerOptions} from "./setup/Server";

export const serverOptions: ServerOptions = {
    port: parseInt(process.env.PORT, 10) || 8080,
};

const Op = Sequelize.Op;
const operatorsAliases = {
    $and: Op.and,
    $or: Op.or,
    $eq: Op.eq,
    $gt: Op.gt,
    $lt: Op.lt,
    $lte: Op.lte,
    $like: Op.like
};
const databaseName = process.env.DB_NAME || "sample_database";
export const databaseOptions: SequelizeConfig = process.env.CLEARDB_DATABASE_URL ? {
    operatorsAliases,
    dialect: "mysql",
    database: databaseName,
    url: process.env.CLEARDB_DATABASE_URL
} : {
    operatorsAliases,
    dialect: "mysql",
    database: databaseName,
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    logging: (constants.isProduction) ? false : console.log,
};