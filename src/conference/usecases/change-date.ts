import {User} from "../../user/entities/user.entity";
import {Executable} from "../../core/executable.interface";
import {IConferenceRepository} from "../../conference/ports/conference-repository.interface";
import {IDateGenerator} from "../../core/ports/date-generator.interface";
import {IBookingRepository} from "../../conference/ports/booking-respository-interface";
import {IMailer} from "../../core/ports/mail.interface";
import {IUserRepository} from "../../user/ports/user-repository.interface";
import {Conference} from "../../conference/entities/conference.entity";
import {ConferenceNotFoundException} from "../../conference/exceptions/conference-not-found";
import {ConferenceUpdateForbiddenException} from "../../conference/exceptions/conference-update-forbidden";

type RequestChangeDate = {
    user: User,
    conferenceId: string,
    startDate: Date,
    endDate: Date,
};

type ResponseChangeDate = void;

export class ChangeDates implements Executable<RequestChangeDate, ResponseChangeDate> {
    constructor(
        private readonly repository: IConferenceRepository,
        private readonly dateGenerator: IDateGenerator,
        private readonly bookingRepository: IBookingRepository,
        private readonly mailer: IMailer,
        private readonly userRepository: IUserRepository,
    ) {
    }

    async execute({user, conferenceId, startDate, endDate}: RequestChangeDate) {
        const conference = await this.repository.findById(conferenceId)

        if(!conference) throw new ConferenceNotFoundException();

        if(conference.props.organizerId !== user.props.id) {
            throw new ConferenceUpdateForbiddenException()
        }

        conference.update({
            startDate,
            endDate
        })

        if(conference.isToClosed(this.dateGenerator.now())) throw new Error('The conference must happen in at least 3 days')

        if(conference.isTooLong()) throw new Error('The conference is too long (> 3 hours)')

        await this.repository.update(conference!)

        await this.sendEmailToParticipant(conference)
    }

    async sendEmailToParticipant(conference: Conference): Promise<void> {
        const bookings = await this.bookingRepository.findByConferenceId(conference.props.id)
        const users = await Promise.all(
            bookings
                .map(booking => this.userRepository.findById(booking.props.userId))
                .filter(user => user !== null)
        ) as User[]

        await Promise.all(
            users.map(user => this.mailer.send({
                from: 'TEDx conference',
                to: user.props.emailAddress,
                subject: `The date of the conference: ${conference.props.title} has been changed`,
                body: `The date of the conference: ${conference.props.title} has been changed`,
            }))
        )
    }
}