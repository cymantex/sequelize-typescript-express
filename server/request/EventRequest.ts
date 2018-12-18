import Request from "./Request";
import {Request as Req, Response} from "express";
import {Sequelize} from "sequelize-typescript";

export default class EventRequest extends Request {
    model: any;

    constructor(req: Req, res: Response, sequelize: Sequelize) {
        super(req, res, sequelize);

        this.model = sequelize.models["Event"];
    }

    async handleGet() {
        const query = this.parseQuery();
        return this.sendStandardResponse(this.model.findAll(query));
    }

    async handlePost() {
        return this.sendStandardResponse(this.model.create(this.req.body));
    }

    async handleUpdate() {
        const query = this.parseQuery();
        return this.sendStandardResponse(this.model.update(this.req.body, query));
    }

    async handleDelete() {
        const query = this.parseQuery();
        return this.model.destroy(query)
            .then(() => this.responseHandler.sendSuccess())
            .catch((err: Error) => this.responseHandler.sendBadRequest(err));
    }
}