import {InMemoryBookingRepository} from "../../conference/adapters/in-memory-booking-repository";
import {testConference} from "../../conference/tests/conference-seeds";
import {testBooking} from "../../conference/tests/booking-seeds";
import {testUser} from "../../user/tests/user-seeds";
import {BookSeat} from "../../conference/usecases/book-seat";

describe('Feature book a seat', () => {

    let bookingRepository: InMemoryBookingRepository;
    let useCase: BookSeat;

    beforeEach(async () => {
        bookingRepository = new InMemoryBookingRepository();
        await bookingRepository.create(testBooking.bobBooking)
        useCase = new BookSeat(bookingRepository);
    })

    describe('Scenario: Happy path', () => {
        const payload = {
            conferenceId: testConference.conference1.props.id,
            userId: testUser.johnDoe.props.id,
        }

        it('Should insert the booking into the database',async () => {
            await useCase.execute(payload)
            const bookings = await bookingRepository.findByConferenceId(payload.conferenceId);

            expect(bookings.length).toBe(2);
        })
    })
    describe('Scenario: The user already booked a seat for this conference', () => {
        const payload = {
            conferenceId: testConference.conference1.props.id,
            userId: testUser.bob.props.id,
        }
        it('Should fail', async () => {
            await expect(useCase.execute(payload)).rejects.toThrow('This user already booked a seat for this' +
                ' conference');
        })
    })
});