import {TestApp} from "../tests/utils/test-app";
import {Application} from "express";
import {e2eUser} from "../tests/seeds/user-seed";
import {e2eConference} from "../tests/seeds/conference-seed";
import {e2eBooking} from "../tests/seeds/booking-seed";
import request from "supertest";
import container from "../infrastructure/express_api/config/dependency-injection";
import {IConferenceRepository} from "../conference/ports/conference-repository.interface";
import {IBookingRepository} from "../conference/ports/booking-respository-interface";


describe("Feature: Book Seats", () => {
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

    describe("Scenario: Happy Path", () => {
        it('Should book a seat', async() => {
            const conferenceId = e2eConference.conference1.entity.props.id;
            const userId = e2eUser.johnDoe.entity.props.id;

            const result = await request(app)
                .post('/conference/booking')
                .set('Authorization', e2eUser.johnDoe.createAuthorizationToken())
                .send({
                    conferenceId,
                    userId
                })

            console.log(result)

            expect(result.status).toBe(201);

            const bookingRepository = container.resolve("bookingRepository") as IBookingRepository;
            const fetchedBooking = await bookingRepository.findByConferenceIdAndUserId(conferenceId, userId)

            expect(fetchedBooking).toBeDefined();
        })
    })
})