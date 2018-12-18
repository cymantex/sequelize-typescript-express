import {setupDatabase} from "../server/setup/setupDatabase";
import settings from "../server/settings.json";
import {Sequelize} from "sequelize-typescript";

export default async (): Promise<Sequelize> => {
    const sequelize: Sequelize = await setupDatabase(settings.database);
    await sequelize.query(`DROP DATABASE ${settings.database.name}`);

    return setupDatabase(settings.database);
};