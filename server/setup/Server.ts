import {log} from "../utils/log";
import http from "http";
import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import * as path from "path";
import {constants} from "../utils/constants";
import glob from "glob";
import Database from "./Database";
import {Sequelize} from "sequelize-typescript";

export interface ServerOptions {
    port: number
}

export default class Server {
    private readonly app: express.Application;
    private readonly options: ServerOptions;
    private server: http.Server;
    private readonly database: Database;

    public constructor(options: ServerOptions, database: Database){
        this.app = express();
        this.options = options;
        this.database = database;
    }

    public async start(): Promise<http.Server> {
        const sequelize = await this.database.connect();
        this.addPlugins();
        this.addRoutes(sequelize);
        return this.listen(this.options.port);
    }

    public async stop(): Promise<void> {
        if(this.server && this.server.listening){
            await this.database.close();
            await this.server.close();
        }
    }

    private async listen(port: number): Promise<http.Server> {
        log.sectionTitle("Starting Server");

        return new Promise<http.Server>(resolve => {
            this.server = this.app.listen(port, () => {
                log.title(`The server is now running on port ${port}.\n`);
                log.apiPoints();
                log.endOfSection();
                resolve(this.server);
            });
        })
    }

    private addPlugins(): void {
        this.app.set("json spaces", 4);
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(bodyParser.json());
        this.app.use(helmet());
        this.app.use(cookieParser());
        this.app.use(cors());
    };

    private addRoutes(sequelize: Sequelize): void {
        glob.sync(`${constants.serverRoot}/routes/*.ts`)
            .forEach(routeFile => require(routeFile).default(this.app, sequelize));

        if(constants.isProduction){
            const projectRoot = path.resolve(`${__dirname}/../..`);
            this.app.use(express.static(`${projectRoot}/client/build`));

            this.app.get("*", (req, res) => {
                res.sendFile(`${projectRoot}/client/build/index.html`);
            });
        }
    };
}