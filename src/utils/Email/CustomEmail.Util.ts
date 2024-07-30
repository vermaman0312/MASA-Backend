import * as nodemailer from 'nodemailer';
import * as dotenv from "dotenv";
import { IMailOptionType } from './Model/Mail.Option.DataType';

dotenv.config();

export const sendMail = (mailOptions: IMailOptionType) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 2525,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSKEY
        }
    });

    transporter.sendMail(mailOptions as nodemailer.SendMailOptions, (error) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent');
        }
    });
}