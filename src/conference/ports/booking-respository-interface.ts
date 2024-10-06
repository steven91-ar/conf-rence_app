import {Booking} from "../../conference/entities/booking.entity";

export interface IBookingRepository {
    create(booking: Booking): Promise<void>;

    findByConferenceId(id: string): Promise<Booking[]>;

    findByConferenceIdAndUserId(conferenceId: string, userId: string): Promise<Booking | null>;
}