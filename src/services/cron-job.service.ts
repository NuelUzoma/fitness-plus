import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from '../database/membership.entity';
import { logger } from 'src/logging/logger';
import * as nodemailer from 'nodemailer';
import { isBefore, subDays } from 'date-fns';


@Injectable()
export class CronJobService {
    constructor(
        @InjectRepository(Membership)
        private readonly membershipRepository: Repository<Membership>,
        private readonly configService: ConfigService,
    ) {}

    @Cron("* * * * *") // Cron job set to run daily every MINUTE!
    async handleCron() {
        logger.info('Cron job triggered');
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

Here is the link to your invoice for this month's add-on service: http://www.fitnesspluss.com/invoices

Best regards,
Fitness+ Team`

            if (membership.isFirstMonth) {
                if (isBefore(today, dueDate) && isBefore(today, reminderDate)) {
                    logger.info(`Sending email to: ${email}`);
                    await this.sendEmail(email, subject, message);
                    logger.info('Sent mail');
                }
            } else {
                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

                if (isBefore(startOfMonth, dueDate) && isBefore(dueDate, endOfMonth)) {
                    logger.info(`Sending email to: ${email}`);
                    await this.sendEmail(email, subject, message);
                    logger.info('Sent mail');
                }
            }
        }
    }

    private async sendEmail(email: string, subject: string, message: string) {
        const transporter = nodemailer.createTransport({
            host: this.configService.get<string>('MAIL_HOST'),
            port: this.configService.get<number>('MAIL_PORT'),
            auth: {
                user: this.configService.get<string>('MAIL_USER'),
                pass: this.configService.get<string>('MAIL_PASS'),
            },
        });

        const mailOptions = {
            from: this.configService.get<string>('MAIL_USER'),
            to: email,
            subject,
            text: message
        };

        logger.info('Sending email with options:', mailOptions);
        await transporter.sendMail(mailOptions);
        logger.info('Email sent successfully');
    }
}