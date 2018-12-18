import {log} from "../utils/log";
import http from "http";
import {setupApp} from "./setupApp";
import {Sequelize} from "sequelize-typescript";
import {DatabaseOptions, setupDatabase} from "./setupDatabase";
import {constants} from "../utils/constants";

export interface AppOptions {
    productionHost?: string,
    host: string,
    port: number,
    database: DatabaseOptions
}

export const startApp = async (
    appOptions: AppOptions
): Promise<{server: http.Server, sequelize: Sequelize}> => {
    const sequelize: Sequelize = await setupDatabase(appOptions.database);
    const app = setupApp(sequelize);

    log.sectionTitle(`Starting Server`);

    return new Promise<{server: http.Server, sequelize: Sequelize}>(resolve => {
        const port = process.env.PORT || appOptions.port;
        const homeUrl = (constants.isProduction)
            ? `https://${appOptions.productionHost}/\n`
            : `http://${appOptions.host}:${port}/\n`;

        const server = app.listen(port, () => {
            log.title("The server is now running.");
            log.message(homeUrl);
            log.apiPoints();
            log.endOfSection();
            resolve({server, sequelize});
        });
    });
};