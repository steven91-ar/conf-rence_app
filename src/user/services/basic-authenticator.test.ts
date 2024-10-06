import {BasicAuthenticator} from "./basic-authenticator";
import {InMemoryUsersRepository} from "../adapters/in-memory-user-repository";
import {User} from "../../user/entities/user.entity";

describe("Authentication", () => {
    let repository: InMemoryUsersRepository;
    let authenticator: BasicAuthenticator;
    beforeAll(async () => {
        repository = new InMemoryUsersRepository()
        await repository.create(new User({
            id: 'john-doe',
            emailAddress: 'johndoe@gmail.com',
            password: 'azerty',
        }))
        authenticator = new BasicAuthenticator(repository);
    })

    describe("Scenario: emailAddress is valid", () => {
        it('Should return a user', async() => {
            const payload = Buffer.from('johndoe@gmail.com:azerty').toString('base64');
            const user = await authenticator.authenticate(payload);

            expect(user.props).toEqual({
                id: 'john-doe',
                emailAddress: 'johndoe@gmail.com',
                password: 'azerty',
            })
        })
    })
    describe("Scenario: token is not valid", () => {
        it('Should throw an error', async() => {
            const payload = Buffer.from('unkown@gmail.com:azerty').toString('base64');
            await expect(authenticator.authenticate(payload)).rejects.toThrow('Wrong credentials');
        })
    })
    describe("Scenario: password is not valid", () => {
        it('Should throw an error', async() => {
            const payload = Buffer.from('johndoe@gmail.com:wrongpassword').toString('base64');
            await expect(authenticator.authenticate(payload)).rejects.toThrow('Wrong credentials');
        })
    })
})