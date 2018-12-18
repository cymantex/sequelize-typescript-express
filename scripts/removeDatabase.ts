import {setupDatabase} from "../server/setup/setupDatabase";
import settings from "../server/settings.json";
import {Sequelize} from "sequelize-typescript";

export default async (): Promise<any> => {
    const sequelize: Sequelize = await setupDatabase(settings.database);
    return sequelize.query(`DROP DATABASE ${settings.database.name}`);
};