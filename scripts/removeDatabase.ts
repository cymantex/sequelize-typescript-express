import Database from "../server/setup/Database";
import {databaseOptions} from "../server/settings";

export default async (): Promise<any> => {
    return new Database(databaseOptions).drop();
};