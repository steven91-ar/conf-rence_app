import {User} from "../../user/entities/user.entity";
import {IConferenceRepository} from "../../conference/ports/conference-repository.interface";
import {Executable} from "../../core/executable.interface";
import {ConferenceNotFoundException} from "../../conference/exceptions/conference-not-found";
import {ConferenceUpdateForbiddenException} from "../../conference/exceptions/conference-update-forbidden";
import {IBookingRepository} from "../../conference/ports/booking-respository-interface";

type RequestChangeSeats = {
    user: User,
    conferenceId: string,
    seats: number
}
type ResponseChangeSeats = void


export class ChangeSeats implements Executable<RequestChangeSeats, ResponseChangeSeats> {
    constructor(
        private readonly repository: IConferenceRepository,
        private readonly bookingRepository: IBookingRepository
    ) {}

    async execute({user, conferenceId, seats}){
        const conference = await this.repository.findById(conferenceId);

        if(!conference) throw new ConferenceNotFoundException();
        if(user.props.id !== conference.props.organizerId) throw new ConferenceUpdateForbiddenException();

        conference.update({seats});

        if(conference.hasNotEnoughSeat() || conference.hasTooManySeats()){
            throw new Error('The conference must have a maximum of 1000 seat and at least 20 seats')
        }

        const bookings = await this.bookingRepository.findByConferenceId(conferenceId);

        if(bookings.length > seats) throw new Error("The conference already has too much booking")

        await this.repository.update(conference);
    }
}