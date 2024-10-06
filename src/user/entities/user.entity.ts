import {Entity} from "../../core/entitites/entity";

type UserProps = {
    id: string,
    emailAddress: string,
    password: string,
}

export class User extends Entity<UserProps> {
}