import {TestApp} from "../../../tests/utils/test-app";
import {Model} from "mongoose";
import {MongoUser} from "../../../user/adapters/mongo/mongo-user";
import {MongoUserRepository} from "../../../user/adapters/mongo/mongo-user-repository";
import {testUser} from "../../../user/tests/user-seeds";

describe('MongoUserRepository', () => {
    let app: TestApp;
    let model: Model<MongoUser.UserDocument>;
    let repository: MongoUserRepository;

    beforeEach(async () => {
        app = new TestApp();
        await app.setup();

        model = MongoUser.UserModel;
        await model.deleteMany({})
        repository = new MongoUserRepository(model);

        const record = new model({
            _id: testUser.johnDoe.props.id,
            emailAddress: testUser.johnDoe.props.emailAddress,
            password: testUser.johnDoe.props.password,
        })

        await record.save();
    })

    afterEach(async() => {
        await app.tearDown();
    })

    describe('Scenario: FindByEmailAddress',() => {
        it('Should find user corresponding to the emailAddress', async () => {
            const user = await repository.findByEmailAddress(testUser.johnDoe.props.emailAddress);

            expect(user?.props).toEqual(testUser.johnDoe.props);
        })
        it('Should return null if user not found', async () => {
            const user = await repository.findByEmailAddress('notexisting@gmail.com');
            expect(user).toBeNull()
        })
    })
    describe('Scenario: Create a user',() => {
        it('Should create a user', async () => {
            await repository.create(testUser.bob)
            const fetchedUser = await model.findOne({_id: testUser.bob.props.id})

            expect(fetchedUser?.toObject()).toEqual({
                _id: testUser.bob.props.id,
                emailAddress: testUser.bob.props.emailAddress,
                password: testUser.bob.props.password,
                __v: 0,
            })
        })
    })
    describe('Scenario: Find user by id',() => {
        it('Should return a user corresponding to the id', async () => {
            const user = await repository.findById(testUser.johnDoe.props.id)
            expect(user?.props).toEqual(testUser.johnDoe.props);
        })
        it('Should return null if user not found', async () => {
            const user = await repository.findByEmailAddress('not-existing-id')
            expect(user).toBeNull();
        })
    })
})