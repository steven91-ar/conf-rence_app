import {IFixture} from "./fixture.interface";
import {User} from "../../user/entities/user.entity";
import {AwilixContainer} from "awilix";
import {IUserRepository} from "../../user/ports/user-repository.interface";

export class UserFixture implements IFixture {
   constructor( public entity: User) {}

    async load(container: AwilixContainer): Promise<void> {
       const repository = container.resolve("userRepository") as IUserRepository;
       await repository.create(this.entity)
    }

    createAuthorizationToken(){
       return 'Basic ' + Buffer.from(`${this.entity.props.emailAddress}:${this.entity.props.password}`).toString('base64')
    }
}