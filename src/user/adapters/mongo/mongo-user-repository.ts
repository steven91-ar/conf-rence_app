import {IUserRepository} from "../../../user/ports/user-repository.interface";
import {User} from "../../../user/entities/user.entity";
import {Model} from "mongoose";
import {MongoUser} from "../../../user/adapters/mongo/mongo-user";

class UserMapper {
    toCore(model: MongoUser.UserDocument): User {
        return new User({
            id: model._id,
            emailAddress: model.emailAddress,
            password: model.password,
        })
    }

    toPersistance(user: User): MongoUser.UserDocument {
        return new MongoUser.UserModel({
            _id: user.props.id,
            emailAddress: user.props.emailAddress,
            password: user.props.password,
        })
    }
}

export class MongoUserRepository implements IUserRepository {

    private readonly mapper = new UserMapper();

    constructor(
        private readonly model: Model<MongoUser.UserDocument>,
    ) {}

    async findByEmailAddress(emailAddress: string): Promise<User | null> {
       const user = await this.model.findOne({emailAddress});

       if(!user) return null;
       return this.mapper.toCore(user)
    }

    async create(user: User): Promise<void> {
       const record = this.mapper.toPersistance(user)
        await record.save()
    }

    async findById(id: string): Promise<User | null> {
        const user = await this.model.findById({_id: id})

        if(!user) return null;
        return this.mapper.toCore(user)
    }
}