import request from 'supertest';
import container from "../infrastructure/express_api/config/dependency-injection";
import {IConferenceRepository} from "../conference/ports/conference-repository.interface";
import {TestApp} from "../tests/utils/test-app";
import {Application} from "express";
import {e2eUser} from "../tests/seeds/user-seed";
import {e2eConference} from "../tests/seeds/conference-seed";


describe('Feature: change the number of seats', () => {

    let testApp: TestApp;
    let app: Application;

    beforeEach(async() => {
        testApp = new TestApp();
        await testApp.setup()
        await testApp.loadAllFixture([
            e2eUser.johnDoe,
            e2eConference.conference1
        ])
        app = testApp.expressApp
    })

    afterAll(async() => {
        await testApp.tearDown()
    })

    describe("Scenario: Happy path", () => {
        it('Should change the number of seats', async () => {
            const seats = 100;
            const id = 'id-1'
            const result = await request(app)
                .patch(`/conference/seats/${id}`)
                .set('Authorization', e2eUser.johnDoe.createAuthorizationToken())
                .send({seats});

            expect(result.status).toBe(200);

            const conferenceRepository = container.resolve('conferenceRepository') as IConferenceRepository;
            const fetchedConference = await conferenceRepository.findById(id);

            expect(fetchedConference).toBeDefined();
            expect(fetchedConference?.props.seats).toEqual(seats)
        })
    })
    describe("Scenario: this user is not authorized", () => {
        it('Should return 403 Unauthorized', async () => {
            const seats = 100;
            const id = 'id-1'
            const result = await request(app)
                .patch(`/conference/seats/${id}`)
                .send({seats});

            expect(result.status).toBe(403);
        })
    })
})