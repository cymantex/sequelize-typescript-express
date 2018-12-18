import MySql from "sequelize";
import {Sequelize} from "sequelize-typescript";
import {SequelizeConfig} from "sequelize-typescript/lib/types/SequelizeConfig";
import {loadDefaultData} from "../utils/constants/defaultData";
import {constants} from "../utils/constants/";

export interface DatabaseOptions {
    name: string,
    dialect: string,
    port: number,
    username: string,
    password: string
}

const hasDatabaseUrl = () => process.env.DATABASE_URL || process.env.CLEARDB_DATABASE_URL;

const createSequelizeFromConfig = async (databaseOptions: DatabaseOptions) => {
    let sequelizeConfig: SequelizeConfig = createSequelizeConfig(databaseOptions);

    const createdDatabase: boolean = await createDatabaseIfNotExists(
        sequelizeConfig,
        databaseOptions.name
    );

    const sequelize = new Sequelize({
        ...sequelizeConfig,
        modelPaths: [`${__dirname}/../models/*.ts`]
    });

    await sequelize.sync();

    if(createdDatabase){
        await loadDefaultData(sequelize);
    }

    return sequelize;
};

const createSequelizeFromUrl = async () => {
    const url = process.env.DATABASE_URL
        ? process.env.DATABASE_URL
        : process.env.CLEARDB_DATABASE_URL;

    const sequelize = new Sequelize(url);
    sequelize.addModels([`${__dirname}/../models/*.ts`]);
    await sequelize.sync();
    const eventRes = await sequelize.models.Event.findAll();

    if(eventRes.length === 0){
        await loadDefaultData(sequelize);
    }

    return sequelize;
};

const createDatabaseIfNotExists = async (
    sequelizeOptions: object | string,
    dbName: string
): Promise<boolean> => {
    const mysql = (typeof sequelizeOptions === "string")
        ? new MySql(sequelizeOptions, {})
        : new MySql(sequelizeOptions);
    const res = await mysql.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    const createdDatabase = res[0].affectedRows === 1;
    await mysql.close();

    return createdDatabase;
};

const createSequelizeConfig = (databaseOptions: DatabaseOptions): SequelizeConfig => {
    const Op = Sequelize.Op;

    return {
        ...databaseOptions,
        operatorsAliases: {
            $and: Op.and,
            $or: Op.or,
            $eq: Op.eq,
            $gt: Op.gt,
            $lt: Op.lt,
            $lte: Op.lte,
            $like: Op.like
        },
        logging: (constants.isTest || constants.isProduction) ? false : console.log
    };
};

export const setupDatabase = async (databaseOptions: DatabaseOptions): Promise<Sequelize> => {
    return hasDatabaseUrl()
        ? await createSequelizeFromUrl()
        : await createSequelizeFromConfig(databaseOptions);
};