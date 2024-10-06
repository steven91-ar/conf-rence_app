import {MongoConference} from "../../../conference/adapters/mongo/mongo-conference";
import {Conference} from "../../../conference/entities/conference.entity";
import {IConferenceRepository} from "../../../conference/ports/conference-repository.interface";
import {Model} from "mongoose";

class ConferenceMapper {
    toCore(model: MongoConference.ConferenceDocument): Conference {
        return new Conference({
            id: model._id,
            organizerId: model.organizerId,
            title: model.title,
            startDate: model.startDate,
            endDate: model.endDate,
            seats: model.seats,
        })
    }

    toPersistance(conference: Conference): MongoConference.ConferenceDocument {
        return new MongoConference.ConferenceModel({
            _id: conference.props.id,
            organizerId: conference.props.organizerId,
            title: conference.props.title,
            startDate: conference.props.startDate,
            endDate: conference.props.endDate,
            seats: conference.props.seats
        })
    }
}


export class MongoConferenceRepository implements IConferenceRepository {
    private readonly mapper = new ConferenceMapper();

    constructor(
        private readonly model: Model<MongoConference.ConferenceDocument>,
    ) {}

    async create(conference: Conference): Promise<void> {
        const record = this.mapper.toPersistance(conference)
        await record.save()
    }

    async findById(id: string): Promise<Conference | null> {
        const conference = await this.model.findById({_id: id})

        if(!conference) return null;
        return this.mapper.toCore(conference)
    }

    async update(conference: Conference): Promise<void> {
        try {
            const conferenceData = this.mapper.toPersistance(conference);
            const updatedConference = await this.model.findByIdAndUpdate(
                conference.props.id,
                { $set: conferenceData },
                { new: true }
            );

            if (!updatedConference) {
                throw new Error(`Conference with ID ${conference.props.id} not found`);
            }

        } catch (error) {
            throw error;
        }
    }
}