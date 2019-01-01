import Server from "./setup/Server";
import {databaseOptions, serverOptions} from "./settings";
import Database from "./setup/Database";
import {log} from "./utils/log";

const database = new Database(databaseOptions);
const server = new Server(serverOptions, database);

server.start().catch(async err => {
    log.error(err);
    await server.stop();
});
