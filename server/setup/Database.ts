import defaultData from "../utils/constants/defaultData";
import {Sequelize} from "sequelize-typescript";
import {SequelizeConfig} from "sequelize-typescript/lib/types/SequelizeConfig";

export default class Database {
    options: SequelizeConfig;
    sequelize: Sequelize;

    constructor(options: SequelizeConfig){
        this.options = options;
        this.sequelize = new Sequelize(options);
    }

    getSequelize(): Sequelize {
        return this.sequelize;
    }

    async drop(): Promise<void> {
        const sequelize = new Sequelize(this.options);
        await sequelize.query(`DROP DATABASE ${this.options.database}`);
        return sequelize.close();
    }

    /**
     * @returns boolean true if the database was created, false otherwise.
     */
    async createIfNotExists(): Promise<boolean> {
        const sequelize = new Sequelize({...this.options, database: ""});
        const res = await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${this.options.database}`);
        const createdDatabase = res[0].affectedRows === 1;
        await sequelize.close();
        return createdDatabase;
    };

    async connect(): Promise<Sequelize> {
        if(await this.createIfNotExists()){
            await this.loadDefaultData();
        }

        this.sequelize.addModels([`${__dirname}/../models/*.ts`]);
        await this.sequelize.sync();
        return this.sequelize;
    }

    async close(): Promise<void> {
        return this.sequelize.close();
    }

    async loadDefaultData(): Promise<void> {
        await this.createIfNotExists();
        const sequelize = new Sequelize(this.options);
        sequelize.addModels([`${__dirname}/../models/*.ts`]);
        await sequelize.sync();

        await Promise.all(Object.keys(defaultData).map(model => {
            return Promise.all(defaultData[model].map(data => {
                return sequelize.models[model].create(data);
            }));
        }));

        return sequelize.close();
    }
}