import Database from "../server/setup/Database";
import {databaseOptions} from "../server/settings";

export default async (): Promise<void> => {
    const database = new Database(databaseOptions);
    await database.drop();
    return database.loadDefaultData();
};