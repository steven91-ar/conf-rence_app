import {testUser} from "../../user/tests/user-seeds";
import {testConference} from "../../conference/tests/conference-seeds";
import {addDays, addHours} from "date-fns";
import {InMemoryConferenceRespository} from "../../conference/adapters/in-memory-conference-repository";
import {ChangeDates} from "../../conference/usecases/change-date";
import {FixedDateGenerator} from "../../core/adapters/fixed-date-generator";
import {InMemoryBookingRepository} from "../../conference/adapters/in-memory-booking-repository";
import {InMemoryMailer} from "../../core/adapters/in-memory-mailer";
import {InMemoryUsersRepository} from "../../user/adapters/in-memory-user-repository";
import {testBooking} from "../../conference/tests/booking-seeds";


describe('Feature: Change date conference', () => {
    async function expectDatesRemainUnchanged(){
        const conference = await repository.findById(testConference.conference1.props.id)
        expect(conference?.props.startDate).toEqual(testConference.conference1.props.startDate)
        expect(conference?.props.endDate).toEqual(testConference.conference1.props.endDate)
    }

    let useCase: ChangeDates;
    let repository: InMemoryConferenceRespository;
    let dateGenerator:FixedDateGenerator ;
    let bookingRepository: InMemoryBookingRepository
    let mailer: InMemoryMailer;
    let userRepository: InMemoryUsersRepository;

    beforeEach(async () => {
        repository = new InMemoryConferenceRespository();
        await repository.create(testConference.conference1);

        dateGenerator = new FixedDateGenerator();
        bookingRepository = new InMemoryBookingRepository();
        await bookingRepository.create(testBooking.bobBooking)
        await bookingRepository.create(testBooking.aliceBooking)

        mailer = new InMemoryMailer();
        userRepository = new InMemoryUsersRepository();
        await userRepository.create(testUser.bob);
        await userRepository.create(testUser.alice);

        useCase = new ChangeDates(
            repository,
            dateGenerator,
            bookingRepository,
            mailer,
            userRepository
        );
    })

    describe('Scenario: Happy path', () => {
        const startDate = addDays(new Date(), 8)
        const endDate = addDays(addHours(new Date(), 2), 8)
        const payload = {
            user: testUser.johnDoe,
            conferenceId: testConference.conference1.props.id,
            startDate,
            endDate,
        };

        it('Should change the dates', async () => {
            await useCase.execute(payload)
            const fetchedConference = await repository.findById(testConference.conference1.props.id);
            expect(fetchedConference!.props.startDate).toEqual(startDate);
            expect(fetchedConference!.props.endDate).toEqual(endDate);
        });
        it('Should send an email to participants', async() => {
            await useCase.execute(payload)
            expect(mailer.sendEmails).toEqual([{
                from: 'TEDx conference',
                to: testUser.bob.props.emailAddress,
                subject: `The date of the conference: ${testConference.conference1.props.title} has been changed`,
                body: `The date of the conference: ${testConference.conference1.props.title} has been changed`,
            },
                {
                    from: 'TEDx conference',
                    to: testUser.alice.props.emailAddress,
                    subject: `The date of the conference: ${testConference.conference1.props.title} has been changed`,
                    body: `The date of the conference: ${testConference.conference1.props.title} has been changed`,
                }])
        })
    })

    describe("Scenario: the conference does not exist", () => {
        const startDate = addDays(new Date(), 8)
        const endDate = addDays(addHours(new Date(), 2), 8)
        const payload = {
            user: testUser.johnDoe,
            conferenceId: "not-existing-id",
            startDate,
            endDate,
        };

        it('Should fail', async () => {
            await expect(useCase.execute(payload)).rejects.toThrow("Conference not found")
            await expectDatesRemainUnchanged();
        })
    })
    describe("Scenario: Update conference of someone else", () => {
        const startDate = addDays(new Date(), 8)
        const endDate = addDays(addHours(new Date(), 2), 8)
        const payload = {
            user: testUser.bob,
            conferenceId: testConference.conference1.props.id,
            startDate,
            endDate,
        };

        it('Should fail', async() => {
            await expect(useCase.execute(payload)).rejects.toThrow('You are not allowed to update this conference')
            await expectDatesRemainUnchanged()
        });
    })

    describe('Scenario: the new startDate is too close', () => {
        const startDate = new Date('2024-01-01T00:00:00.000Z')
        const endDate = new Date('2024-01-02T02:00:00.000Z')
        const payload = {
            user: testUser.johnDoe,
            conferenceId: testConference.conference1.props.id,
            startDate,
            endDate,
        };
        it('Should fail', async() => {
            await expect(useCase.execute(payload)).rejects.toThrow('The conference must happen in at least 3 days')
            await expectDatesRemainUnchanged()
        });
    })
    describe('Scenario: the updated conference is too long', () => {
        const startDate = new Date('2024-01-08T00:00:00.000Z')
        const endDate = new Date('2024-01-08T05:00:00.000Z')
        const payload = {
            user: testUser.johnDoe,
            conferenceId: testConference.conference1.props.id,
            startDate,
            endDate,
        };
        it('Should fail', async() => {
            await expect(useCase.execute(payload)).rejects.toThrow('The conference is too long (> 3 hours)')
            await expectDatesRemainUnchanged()
        });
    })
})