import "../serverTest";
import {expect} from "chai";
import {routes} from "../../utils/constants/routes";
import request, {Response} from "supertest";
import {httpCodes} from "../../utils/constants/httpCodes";

const checkSuccess = (response: Response) => {
    console.log(response.text);
    expect(response.status).to.be.equal(httpCodes.SUCCESS);
};

const checkBadRequest = () => (response: Response) => {
    console.log(response.text);
    expect(response.status).to.be.equal(httpCodes.BAD_REQUEST);
};

describe("Routes", function(){
    it("Should successfully GET all gettable routes.", () => {
        const gettableRoutes = [
            routes.event
        ];

        return Promise.all(gettableRoutes.map(route => request(global.app).get(route)))
            .then(responses => responses.forEach(checkSuccess));
    });

    describe(routes.event, () => {
        it("Should add valid event", () => {
            return request(global.app)
                .post(routes.event)
                .send({gender: "Kille", location: "bar", measure: "foo"})
                .then(checkSuccess);
        });

        it("Should not add event with empty location or measure", () => {
            return request(global.app)
                .post(routes.event)
                .send({gender: "Kille", location: "", measure: ""})
                .then(checkBadRequest);
        });

        it("Should get event based on query", () => {
            return request(global.app)
                .get(routes.event)
                .query({
                    where: {
                        location: "bar"
                    }
                })
                .then(checkSuccess);
        });

        it("Should update event based on query", () => {
            return request(global.app)
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
            return request(global.app)
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