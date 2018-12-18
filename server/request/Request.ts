import {Request as Req, Response} from "express";
import {Sequelize} from "sequelize-typescript";
import ResponseHandler from "../utils/ResponseHandler";

export default abstract class Request {
    req: Req;
    responseHandler: ResponseHandler;
    sequelize: Sequelize;

    protected constructor(req: Req, res: Response, sequelize: Sequelize) {
        this.req = req;
        this.responseHandler = new ResponseHandler(res);
        this.sequelize = sequelize;
    }

    protected parseQuery(): any {
        const query = (this.req.query) ? this.req.query : {};
        let parsedQuery: {[key: string]: string} = {};

        Object.keys(query).forEach(key => {
            const value = query[key];
            try {
                parsedQuery[key] = (typeof value === "string")
                    ? JSON.parse(query[key])
                    : query[key];
            } catch(e){
                parsedQuery[key] = query[key];
            }
        });

        return parsedQuery;
    }

    protected async sendStandardResponse(promise: Promise<any>) {
        return promise
            .then(response => this.responseHandler.sendSuccess(response))
            .catch(err => this.responseHandler.sendBadRequest(err));
    }

    public async handle() {
        switch(this.req.method){
        case "GET":
            return this.handleGet();
        case "PUT":
            return this.handleUpdate();
        case "POST":
            return this.handlePost();
        case "DELETE":
            return this.handleDelete();
        default:
            return this.responseHandler.sendMethodNotAllowed();
        }
    };

    protected async handleGet() {
        return this.responseHandler.sendMethodNotAllowed();
    }

    protected async handlePost() {
        return this.responseHandler.sendMethodNotAllowed();
    }

    protected async handleDelete() {
        return this.responseHandler.sendMethodNotAllowed();
    }

    protected async handleUpdate() {
        return this.responseHandler.sendMethodNotAllowed();
    }
}