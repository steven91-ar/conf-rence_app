import {IsDateString, IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CreateConferenceInput {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsNumber()
    @IsNotEmpty()
    seats: number

    @IsDateString()
    @IsNotEmpty()
    startDate: Date

    @IsDateString()
    @IsNotEmpty()
    endDate: Date
}

export class ChangeSeatsInput {
    @IsNumber()
    @IsNotEmpty()
    seats: number
}

export class ChangeDateInput {
    @IsNotEmpty()
    @IsDateString()
    startDate: Date

    @IsNotEmpty()
    @IsDateString()
    endDate: Date
}

export class BookSeatInput {
    @IsNotEmpty()
    @IsString()
    conferenceId: string

    @IsNotEmpty()
    @IsString()
    userId: string
}