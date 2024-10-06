import {IFixture} from "../../tests/fixtures/fixture.interface";
import {Booking} from "../../conference/entities/booking.entity";
import {AwilixContainer} from "awilix";
import {IBookingRepository} from "../../conference/ports/booking-respository-interface";

export class BookingFixture implements IFixture {
    constructor (public readonly entity: Booking) {}

    async load(container: AwilixContainer): Promise<void> {
        const repository = container.resolve("bookingRepository") as IBookingRepository;
        await repository.create(this.entity)
    }
}