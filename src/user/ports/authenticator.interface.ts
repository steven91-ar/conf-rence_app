import {User} from "../../user/entities/user.entity";

export interface IAuthenticator {
    authenticate(token: string): Promise<User>
}