import {Express, Request, Response} from "express";
import {routes} from "../utils/constants/routes";
import {Sequelize} from "sequelize-typescript";
import EventRequest from "../request/EventRequest";

export default (app: Express, sequelize: Sequelize) => {
    app.use(`${routes.event}`, (req: Request, res: Response) => {
        return new EventRequest(req, res, sequelize).handle();
    });
};