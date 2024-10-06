import {TestApp} from "../tests/utils/test-app";
import {Application} from "express";
import {e2eUser} from "../tests/seeds/user-seed";
import {e2eConference} from "../tests/seeds/conference-seed";
import {e2eBooking} from "../tests/seeds/booking-seed";
import {addDays, addHours} from "date-fns";
import request from "supertest";
import {testUser} from "../user/tests/user-seeds";
import {testConference} from "../conference/tests/conference-seeds";
import container from "../infrastructure/express_api/config/dependency-injection";
import {IConferenceRepository} from "../conference/ports/conference-repository.interface";


describe('Feature: Change the conference date', () => {

    let testApp: TestApp;
    let app: Application;

    beforeEach(async () => {
        testApp = new TestApp();
        await testApp.setup()
        await testApp.loadAllFixture([
            e2eUser.johnDoe,
            e2eUser.bob,
            e2eUser.alice,
            e2eConference.conference1,
            e2eBooking.bobBooking,
            e2eBooking.aliceBooking
        ])
        app = testApp.expressApp
    })

    afterAll(async () => {
        await testApp.tearDown()
    })

    describe('Scenario: Happy Path',  () => {
        it('Should change the conference date', async () => {
            const id = e2eConference.conference1.entity.props.id
            const startDate = addDays(new Date(), 8);
            const endDate = addDays(addHours(new Date(), 2), 8);


            const result = await request(app)
                .patch(`/conference/date/${id}`)
                .set('Authorization', e2eUser.johnDoe.createAuthorizationToken())
                .send({
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                })

            expect(result.status).toBe(200);

            const conferenceRepository = container.resolve('conferenceRepository') as IConferenceRepository;
            const fetchedConference = await conferenceRepository.findById(id);

            expect(fetchedConference).toBeDefined();
            expect(fetchedConference?.props.startDate).toEqual(startDate)
            expect(fetchedConference?.props.endDate).toEqual(endDate)
        })


    })
    describe('Scenario: the user is not authorized', () => {
        it('Should return 403 Unauthorized', async () => {
            const id = e2eConference.conference1.entity.props.id
            const startDate = addDays(new Date(), 8);
            const endDate = addDays(addHours(new Date(), 2), 8);

            const result = await request(app)
                .patch(`/conference/date/${id}`)
                .send({startDate, endDate})

            expect(result.status).toBe(403);
        })
    })
})