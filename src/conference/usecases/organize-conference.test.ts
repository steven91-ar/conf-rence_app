import {OrganizeConference} from "./organize-conference";
import {InMemoryConferenceRespository} from "../adapters/in-memory-conference-repository";
import {FixedIdGenerator} from "../../core/adapters/fixed-id-generator";
import {Conference} from "../entities/conference.entity";
import {FixedDateGenerator} from "../../core/adapters/fixed-date-generator";
import {User} from "../../user/entities/user.entity";


describe('Feature organize conference', () => {
    function expectConferenceToEqual(conference: Conference) {
        expect(conference.props).toEqual({
            id: 'id-1',
            organizerId: "john-doe",
            title: 'My first conference',
            seats: 100,
            startDate:new Date('2024-09-01T10:00:00.000Z'),
            endDate:new Date('2024-09-01T11:00:00.000Z'),
        });
    }

    const jonhDoe = new User({
        id: "john-doe",
        emailAddress: "john-doe@gmail.com",
        password: "azerty",
    })

    let repository: InMemoryConferenceRespository;
    let idGenerator: FixedIdGenerator;
    let userCase: OrganizeConference;
    let dateGenerator: FixedDateGenerator

    beforeEach(() => {
        repository = new InMemoryConferenceRespository();
        idGenerator = new FixedIdGenerator();
        dateGenerator = new FixedDateGenerator();
        userCase = new OrganizeConference(repository, idGenerator, dateGenerator);
    })

    describe('Scenario: Happy path', () => {
        const payload = {
            user: jonhDoe,
            title: 'My first conference',
            seats: 100,
            startDate:new Date('2024-09-01T10:00:00.000Z'),
            endDate:new Date('2024-09-01T11:00:00.000Z'),
        }
        it('should return the ID', async () => {
            const result = await userCase.execute(payload);

            expect(result.id).toEqual('id-1');
        })

        it('should insert the conference into the database', async() => {
            await userCase.execute(payload);
            const createdConference = repository.database[0];

            expect(repository.database.length).toBe(1);
            expectConferenceToEqual(createdConference);
        })
    })

    describe('Scenario: Conference happens too soon', () => {
        const payload = {
            user: jonhDoe,
            title: 'My first conference',
            seats: 100,
            startDate:new Date('2024-01-02T10:00:00.000Z'),
            endDate:new Date('2024-01-02T11:00:00.000Z'),
        }

        it('Should throw an error', async () => {
            await expect(userCase.execute(payload)).rejects.toThrow("The conference must happens in at least 3" +
                " days");
        })

        it('Should not create a conference', async () => {
            try {
              await expect(() => userCase.execute(payload)).rejects.toThrow();
            } catch (error) {}

            expect(repository.database.length).toBe(0);
        })
    })

    describe('Scenario: Conference has too many seats', () => {
        const payload = {
            user: jonhDoe,
            title: 'My first conference',
            seats: 1101,
            startDate:new Date('2024-01-10T10:00:00.000Z'),
            endDate:new Date('2024-01-10T11:00:00.000Z'),
        }

        it('Should throw an error', async () => {
            await expect(userCase.execute(payload)).rejects.toThrow('The conference has too many seats (< 1000)');
        })

        it('Should not create a conference', async () => {
            try {
                await expect(() => userCase.execute(payload)).rejects.toThrow();
            } catch (error) {}

            expect(repository.database.length).toBe(0);
        })
    })

    describe('Scenario: Conference has not enough many seats', () => {
        const payload = {
            user: jonhDoe,
            title: 'My first conference',
            seats: 10,
            startDate:new Date('2024-01-10T10:00:00.000Z'),
            endDate:new Date('2024-01-10T11:00:00.000Z'),
        }

        it('Should throw an error', async () => {
            await expect(userCase.execute(payload)).rejects.toThrow('The conference has not enough seats (>= 20)');
        })

        it('Should not create a conference', async () => {
            try {
                await expect(() => userCase.execute(payload)).rejects.toThrow();
            } catch (error) {}

            expect(repository.database.length).toBe(0);
        })
    })

    describe('Scenario: Conference is too long', () => {
        const payload = {
            user: jonhDoe,
            title: 'My first conference',
            seats: 100,
            startDate:new Date('2024-01-10T10:00:00.000Z'),
            endDate:new Date('2024-01-10T14:00:00.000Z'),
        }

        it('Should throw an error', async () => {
            await expect(userCase.execute(payload)).rejects.toThrow('The conference is too long');
        })

        it('Should not create a conference', async () => {
            try {
                await expect(() => userCase.execute(payload)).rejects.toThrow();
            } catch (error) {}

            expect(repository.database.length).toBe(0);
        })
    })
})