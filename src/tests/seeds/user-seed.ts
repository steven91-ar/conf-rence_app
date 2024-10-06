import {UserFixture} from "../fixtures/user-fixture";
import {User} from "../../user/entities/user.entity";


export const e2eUser = {
    johnDoe: new UserFixture(new User({
        id: 'john-doe',
        emailAddress: 'johndoe@gmail.com',
        password: 'azerty',
    })),
    bob: new UserFixture(new User({
        id: "bod",
        emailAddress: "bob@gmail.com",
        password: "azety"
    })),
    alice: new UserFixture(new User({
        id: "alice",
        emailAddress: "alice@gmail.com",
        password: "azety"
    }))
}