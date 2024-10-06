import {Email, IMailer} from "../../core/ports/mail.interface";

export class InMemoryMailer implements IMailer {
    public readonly sendEmails: Email[] = [];

    async send(email: Email): Promise<void> {
        this.sendEmails.push(email);
    }
}