import {IConferenceRepository} from "../ports/conference-repository.interface";
import {Conference} from "../entities/conference.entity";
import {IIdGenerator} from "../../core/ports/id-generator.interface";
import {IDateGenerator} from "../../core/ports/date-generator.interface";
import {User} from "../../user/entities/user.entity";
import {Executable} from "../../core/executable.interface";
import {DomainException} from "../../core/exceptions/domain-exception";


type OrganizeRequest = {
    user: User,
    title: string,
    startDate: Date,
    endDate: Date,
    seats: number
}

type OrganizeResponse = {
    id: string
}

export class OrganizeConference implements Executable<OrganizeRequest, OrganizeResponse>{
    constructor(
        private readonly repository: IConferenceRepository,
        private readonly idGenerator: IIdGenerator,
        private readonly dateGenerator: IDateGenerator,
    ) {}

     async execute({user,title, startDate, endDate, seats}) {
        const id = this.idGenerator.generate();

        const newConference = new Conference({
            id,
            organizerId: user.props.id,
            title,
            startDate,
            endDate,
            seats
        })

         if (newConference.isToClosed(this.dateGenerator.now())){
             throw new DomainException("The conference must happens in at least 3" +
                 " days");
         }

         if(newConference.hasTooManySeats()){
             throw new DomainException('The conference has too many seats (< 1000)')
         }

         if (newConference.hasNotEnoughSeat()){
             throw new DomainException('The conference has not enough seats (>= 20)')
         }

         if(newConference.isTooLong()){
             throw new DomainException('The conference is too long')
         }

        await this.repository.create(newConference);

         return {id};
     }
}