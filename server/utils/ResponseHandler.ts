import {constants} from "./constants/";
import {httpCodes} from "./constants/httpCodes";
import {Response} from "express";

const {
    SUCCESS,
    SOMETHING_WENT_WRONG,
    BAD_REQUEST,
    UNAUTHORIZED,
    METHOD_NOT_ALLOWED,
    NOT_FOUND,
    REDIRECT,
    CREATED
} = httpCodes;

const printErrorIfDevelopment = (err: Error) => {
    if(constants.isDevelopment) console.error(err);
};

export default class ResponseHandler {
    res: Response;

    constructor(res: Response) {
        this.res = res;
    }

    redirect(page: string) {
        this.res.redirect(REDIRECT, page);
    };

    sendSuccess(data = {}) {
        this.res.send(data);
    };

    sendCreated() {
        this.res.sendStatus(CREATED);
    };

    sendNotFound(err: Error) {
        printErrorIfDevelopment(err);
        this.res.status(NOT_FOUND).send(err.toString());
    };

    sendUnauthorized(err: Error) {
        printErrorIfDevelopment(err);
        this.res.sendStatus(UNAUTHORIZED);
    };

    sendMethodNotAllowed() {
        this.res.sendStatus(METHOD_NOT_ALLOWED);
    };

    sendSomethingWentWrong(err: Error) {
        printErrorIfDevelopment(err);
        this.res.status(SOMETHING_WENT_WRONG).send(err.toString());
    };

    sendBadRequest(err: Error) {
        printErrorIfDevelopment(err);
        this.res.status(BAD_REQUEST).send(err.toString());
    };

    handlePromiseResponse(promise: Promise<any>) {
        return promise
            .then(() => this.res.sendStatus(SUCCESS))
            .catch(err => this.sendSomethingWentWrong(err));
    };
}