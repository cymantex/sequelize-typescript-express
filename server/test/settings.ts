import {ServerOptions} from "../setup/Server";
import {Sequelize} from "sequelize-typescript";
import {SequelizeConfig} from "sequelize-typescript/lib/types/SequelizeConfig";

export const serverOptions: ServerOptions = {
    port: 8081,
};

const Op = Sequelize.Op;
export const databaseOptions: SequelizeConfig = {
    operatorsAliases: {
        $and: Op.and,
        $or: Op.or,
        $eq: Op.eq,
        $gt: Op.gt,
        $lt: Op.lt,
        $lte: Op.lte,
        $like: Op.like
    },
    dialect: "mysql",
    database: "test_database",
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    logging: false
};