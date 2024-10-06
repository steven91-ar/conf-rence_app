import {IUserRepository} from "../ports/user-repository.interface";
import {User} from "../../user/entities/user.entity";

export class InMemoryUsersRepository implements IUserRepository {
    private users: User[] = []

    async create(user: User): Promise<void> {
        this.users.push(user)
    }

    async findByEmailAddress(emailAddress: string): Promise<User | null> {
        const user = this.users.find(user => user.props.emailAddress === emailAddress);
        return user ?? null
    }

    async findById(id: string): Promise<User | null> {
        const user = this.users.find(user => user.props.id === id)
        return user ?? null
    }
}