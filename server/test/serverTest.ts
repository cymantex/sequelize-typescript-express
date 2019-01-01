import {serverOptions, databaseOptions} from "./settings";
import Server, {ServerOptions} from "../setup/Server";
import Database from "../setup/Database";
import {SequelizeConfig} from "sequelize-typescript/lib/types/SequelizeConfig";
import http from "http";

declare global {
    namespace NodeJS {
        interface Global {
            app: http.Server
        }
    }
}

class ServerTest {
    server: Server;
    database: Database;

    constructor(databaseOptions: SequelizeConfig, serverOptions: ServerOptions){
        this.database = new Database(databaseOptions);
        this.server = new Server(serverOptions, this.database);
    }

    async start(): Promise<http.Server> {
        await this.database.drop();
        return await this.server.start();
    }

    async stop(){
        await this.server.stop();
    }
}

const serverTest = new ServerTest(databaseOptions, serverOptions);
before(async () => {
    global.app = await serverTest.start();
});
after(async () => await serverTest.stop());