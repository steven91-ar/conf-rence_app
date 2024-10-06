import {IDateGenerator} from "../../core/ports/date-generator.interface";

export class FixedDateGenerator implements IDateGenerator{
    now(): Date {
        return new Date('2024-01-01T00:00:00.000Z');
    }
}