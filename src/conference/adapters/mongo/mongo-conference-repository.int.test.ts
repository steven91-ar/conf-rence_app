import {TestApp} from "../../../tests/utils/test-app";
import {Model} from "mongoose";
import {testConference} from "../../tests/conference-seeds";
import {MongoConference} from "../../../conference/adapters/mongo/mongo-conference";
import {MongoConferenceRepository} from "../../../conference/adapters/mongo/mongo-conference-repository";
import {Conference} from "../../../conference/entities/conference.entity";


describe("MongoConferenceRepository", () => {
    let app: TestApp;
    let model: Model<MongoConference.ConferenceDocument>;
    let repository: MongoConferenceRepository;

    beforeEach(async() => {
        app = new TestApp();
        await app.setup();

        model = MongoConference.ConferenceModel;
        await model.deleteMany({})
        repository = new MongoConferenceRepository(model);

        const record = new model({
            _id: testConference.conference1.props.id,
            organizerId: testConference.conference1.props.organizerId,
            title: testConference.conference1.props.title,
            startDate: testConference.conference1.props.startDate,
            endDate: testConference.conference1.props.endDate,
            seats: testConference.conference1.props.seats,
            }
        )
        await record.save();
    })

    afterEach(async() => {
        await app.tearDown();
    })


    describe("Scenario: FindById", () => {
        it('Should find conference corresponding to th id', async () => {
            const conference = await repository.findById(testConference.conference1.props.id);

            expect(conference?.props).toEqual(testConference.conference1.props);
        })
        it("Should return null if conference not found", async() => {
            const conference = await repository.findById("not-existing-id");
            expect(conference).toBeNull()
        })
    })

    describe('Scenario: Create a conference',() => {
        it("Should create a conference", async() =>{
            await repository.create(testConference.conference2);
            const fetchedConference = await model.findOne({_id: testConference.conference2.props.id})

            expect(fetchedConference?.toObject()).toEqual({
                _id: testConference.conference2.props.id,
                title: testConference.conference2.props.title,
                organizerId: testConference.conference2.props.organizerId,
                startDate: testConference.conference2.props.startDate,
                endDate: testConference.conference2.props.endDate,
                seats: testConference.conference2.props.seats,
                __v: 0,
            })
        })
    })

    describe('Scenario: Update a conference',() => {
        it('should update the conference', async () => {
            const conference: Conference = new Conference({
                id: testConference.conference1.props.id,
                organizerId: testConference.conference1.props.organizerId,
                title: "New conference title",
                startDate: testConference.conference1.props.startDate,
                endDate: testConference.conference1.props.endDate,
                seats: testConference.conference1.props.seats,
            })
           await repository.update(conference);
            const fetchedConference = await repository.findById(testConference.conference1.props.id);
            console.log("fetchedConference :", fetchedConference)
            expect(fetchedConference?.props.title).toEqual("New conference title");
        });
    })
})