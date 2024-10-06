import {Entity} from "../../core/entitites/entity";

type BookingProps = {
    userId: string,
    conferenceId: string
}

export class Booking extends Entity<BookingProps> {

}