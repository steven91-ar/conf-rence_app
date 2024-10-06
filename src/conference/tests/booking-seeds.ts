import {testConference} from "../../conference/tests/conference-seeds";
import {Booking} from "../../conference/entities/booking.entity";
import {testUser} from "../../user/tests/user-seeds";


const numberOfBookings = 30;

export const testBooking = {
    bookings:
        Array.from({ length: numberOfBookings }, (_, index) => {
        return new Booking({
            userId: `user-${index + 1}`,
            conferenceId: testConference.conference1.props.id,
        });
    }),

    bobBooking: new Booking({
        userId: testUser.bob.props.id,
        conferenceId: testConference.conference1.props.id,
    }),
    aliceBooking: new Booking({
        userId: testUser.alice.props.id,
        conferenceId: testConference.conference1.props.id,
    })
};
