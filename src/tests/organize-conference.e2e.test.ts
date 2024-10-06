import request from 'supertest';
import {addDays, addHours} from "date-fns";
import container from "../infrastructure/express_api/config/dependency-injection";
import {IConferenceRepository} from "../conference/ports/conference-repository.interface";
import {TestApp} from "../tests/utils/test-app";
import {Application} from "express";
import {e2eUser} from "../tests/seeds/user-seed";


describe('Feature: Organize conference', () => {

    let testApp: TestApp;
    let app: Application;

    beforeEach(async() => {
        testApp = new TestApp();
        await testApp.setup()
        await testApp.loadAllFixture([e2eUser.johnDoe])
        app = testApp.expressApp
    })

    afterAll(async() => {
        await testApp.tearDown()
    })

    it('Should organize a conference', async () => {
        const startDate = addDays(new Date(), 4);
        const endDate = addDays(addHours(new Date(), 2), 4);
        const result = await request(app)
            .post('/conference')
            .set('Authorization', e2eUser.johnDoe.createAuthorizationToken())
            .send({
                title: 'My first conference',
                seats: 100,
                startDate: startDate,
                endDate: endDate,
            });

        expect(result.status).toBe(201);
        expect(result.body.data).toEqual({id: expect.any(String)});

        const conferenceRepository = container.resolve('conferenceRepository') as IConferenceRepository;
        const fetchedConference = await conferenceRepository.findById(result.body.data.id);

        expect(fetchedConference).toBeDefined();
        expect(fetchedConference?.props).toEqual({
            id: result.body.data.id,
            organizerId: e2eUser.johnDoe.entity.props.id,
            title: 'My first conference',
            seats: 100,
            startDate: startDate,
            endDate: endDate,
        })
    })
})