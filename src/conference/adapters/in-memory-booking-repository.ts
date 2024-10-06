import {IBookingRepository} from "../../conference/ports/booking-respository-interface";
import {Booking} from "../../conference/entities/booking.entity";

export class InMemoryBookingRepository implements IBookingRepository {
    public database: Booking[] = []

    async create(booking: Booking): Promise<void> {
        this.database.push(booking);
    }

    async findByConferenceId(id: string): Promise<Booking[]> {
        return this.database.filter(booking => booking.props.conferenceId === id)
    }

    async findByConferenceIdAndUserId(userId: string, conferenceId: string): Promise<Booking | null> {
        return this.database.find(
            booking => booking.props.userId === userId && booking.props.conferenceId === conferenceId
        ) || null;
    }
}