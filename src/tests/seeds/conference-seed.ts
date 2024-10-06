import {ConferenceFixture} from "../../tests/fixtures/conference-fixture";
import {Conference} from "../../conference/entities/conference.entity";
import {e2eUser} from "../../tests/seeds/user-seed";
import {addDays, addHours} from "date-fns";

export const e2eConference = {
    conference1: new ConferenceFixture(
        new Conference({
            id: 'id-1',
            organizerId: e2eUser.johnDoe.entity.props.id,
            title: 'My first conference',
            seats: 50,
            startDate: addDays(new Date(), 4),
            endDate: addDays(addHours(new Date(), 2), 4),
        })
    )
}