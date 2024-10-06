import {IFixture} from "../../tests/fixtures/fixture.interface";
import {Conference} from "../../conference/entities/conference.entity";
import {AwilixContainer} from "awilix";

export class ConferenceFixture implements IFixture {
    constructor(public entity: Conference) {}

    async load(container: AwilixContainer): Promise<void> {
            const repository = container.resolve("conferenceRepository");
            await repository.create(this.entity)
    }
}