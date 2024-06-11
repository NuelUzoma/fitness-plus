import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from '../database/membership.entity';
import * as nodemailer from 'nodemailer';
import { isBefore, subDays } from 'date-fns';


@Injectable()
export class CronJobService {
    constructor(
        @InjectRepository(Membership)
        private readonly membershipRepository: Repository<Membership>,
    ) {}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) // Cron job set to run daily at midnight
    async handleCron() {
        const memberships = await this.membershipRepository.find();

        const today = new Date();

        for (const membership of memberships) {
            const dueDate = new Date(membership.dueDate);
            const reminderDate = subDays(dueDate, 7);

            const email = membership.email;

            const subject = `Fitness+ Membership Reminder - ${membership.membershipType}`;

            const message = `Dear ${membership.firstName},

            This is a reminder for your upcoming add-on service payment. Below are the details:

            Membership Type: ${membership.membershipType}
            Month: ${today.toLocaleString('default', { month: 'long' })}
            Total Amount: $${membership.totalAmount}

            Please make sure to complete the payment to continue enjoying our services.

            Here is the link to your invoice for this month's add-on service: http://www.fitness.com/invoices

            Best regards,
            Fitness+ Team`

            if (membership.isFirstMonth) {
                if (isBefore(today, dueDate) && isBefore(today, reminderDate)) {
                  await this.sendEmail(email, subject, message);
                }
            } else {
                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

                if (isBefore(startOfMonth, dueDate) && isBefore(dueDate, endOfMonth)) {
                    await this.sendEmail(email, subject, message);
                }
            }
        }
    }

    private async sendEmail(email: string, subject: string, message: string) {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT),
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },
        });

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject,
            text: message
        }

        await transporter.sendMail(mailOptions);
    }
}