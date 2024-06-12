import nodemailer from 'nodemailer'
import pug from 'pug'
import path from 'path'
import config from 'config'
import { User } from '../entities/users.entity'
import { convert } from 'html-to-text'

const smtp = config.get<{
    host: string,
    pass: string,
    port: number,
    user: string,
}>('smtp');

export default class Email {
    firstName: string;
    to: string;
    from: string;

    constructor(public user: User, public url: string) {
        this.firstName = user.name
        this.to = user.email
        this.from = `${config.get<string>('emailFrom')}`
    }

    private newTransport () {
        return nodemailer.createTransport({
            ...smtp,
            auth: {
                user: smtp.user,
                pass: smtp.pass
            }
        })
    }

    private async send (template: string, subject: string) {
        const testUrl = path.join(__dirname, `../views/${template}.pug`)
        
        const html = pug.renderFile(testUrl, {
            firstName: this.firstName,
            subject: subject,
            url: this.url,
        })

        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            text: convert(html),
            html,
        };

        await this.newTransport().sendMail(mailOptions);
    }

    async sendVerificationCode() {
        await this.send('verificationCode', 'Your account verification code');
    }
}
