import {Executable} from "../../core/executable.interface";
import {IBookingRepository} from "../../conference/ports/booking-respository-interface";
import {Booking} from "../../conference/entities/booking.entity";


type RequestBookSeat ={
    conferenceId: string,
    userId: string,
}

type ResponseBookSeat = void


export class BookSeat implements Executable<RequestBookSeat, ResponseBookSeat> {
    constructor(private readonly repository: IBookingRepository) {}

    async execute({conferenceId, userId}){

        const existingBooking = await this.repository.findByConferenceIdAndUserId(userId, conferenceId);

        if (existingBooking) {
            throw new Error('This user already booked a seat for this conference');
        }




        const newBooking = new Booking({
            conferenceId,
            userId
        })

        await this.repository.create(newBooking)
    }
}