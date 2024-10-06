import {IAuthenticator} from "../ports/authenticator.interface";
import {User} from "../../user/entities/user.entity";
import {IUserRepository} from "../ports/user-repository.interface";

export class BasicAuthenticator implements IAuthenticator {
    constructor(private readonly userRepository: IUserRepository) {}

    async authenticate(token: string): Promise<User> {
        const decoded = Buffer.from(token, "base64").toString("utf-8");
        const [emailAddress, password] = decoded.split(':')
        const user = await this.userRepository.findByEmailAddress(emailAddress)
        if(!user || user.props.password !== password) throw new Error("Wrong credentials");

        return user
    }
}