import {expect} from "chai";
import {startApp} from "../../setup/startApp";
import {setupDatabase} from "../../setup/setupDatabase";
import http from "http";
import {routes} from "../../utils/constants/routes";
import request, {Response} from "supertest";
import {httpCodes} from "../../utils/constants/httpCodes";
import {Sequelize} from "sequelize-typescript";
import settings from "../settings.json";

let server: http.Server = null;
let sequelize: Sequelize = null;

const checkSuccess = (response: Response) => {
    console.log(response.text);
    expect(response.status).to.be.equal(httpCodes.SUCCESS);
};

const checkBadRequest = () => (response: Response) => {
    console.log(response.text);
    expect(response.status).to.be.equal(httpCodes.BAD_REQUEST);
};

before(async () => {
    sequelize = await setupDatabase(settings.database);
    await sequelize.query(`DROP DATABASE ${settings.database.name}`);
    await sequelize.close();

    let app = await startApp(settings);
    server = app.server;
    sequelize = app.sequelize;
});

describe("Routes", function(){
    it("Should successfully GET all gettable routes.", () => {
        const gettableRoutes = [
            routes.event
        ];

        return Promise.all(gettableRoutes.map(route => request(server).get(route)))
            .then(responses => responses.forEach(checkSuccess));
    });

    describe(routes.event, () => {
        it("Should add valid event", () => {
            return request(server)
                .post(routes.event)
                .send({gender: "Kille", location: "bar", measure: "foo"})
                .then(checkSuccess);
        });

        it("Should not add event with empty location or measure", () => {
            return request(server)
                .post(routes.event)
                .send({gender: "Kille", location: "", measure: ""})
                .then(checkBadRequest);
        });

        it("Should get event based on query", () => {
            return request(server)
                .get(routes.event)
                .query({
                    where: {
                        location: "bar"
                    }
                })
                .then(checkSuccess);
        });

        it("Should update event based on query", () => {
            return request(server)
                .put(routes.event)
                .send({location: "foobar"})
                .query({
                    where: {
                        location: "bar"
                    }
                })
                .then(checkSuccess);
        });

        it("Should delete event based on query", () => {
            return request(server)
                .del(routes.event)
                .query({
                    where: {
                        id: 1
                    }
                })
                .then(checkSuccess);
        });
    });
});

after(() => {
    server.close();
    sequelize.close();
});