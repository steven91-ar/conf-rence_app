import {BookingFixture} from "../../tests/fixtures/booking-fixture";
import {Booking} from "../../conference/entities/booking.entity";
import {e2eUser} from "../../tests/seeds/user-seed";
import {e2eConference} from "../../tests/seeds/conference-seed";


export const e2eBooking = {
    bobBooking: new BookingFixture(new Booking({
        userId: e2eUser.bob.entity.props.id,
        conferenceId: e2eConference.conference1.entity.props.id,
    })),
    aliceBooking: new BookingFixture(new Booking({
        userId: e2eUser.alice.entity.props.id,
        conferenceId: e2eConference.conference1.entity.props.id,
    }))
}