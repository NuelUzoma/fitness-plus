import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership, MembershipType } from '../database/membership.entity';
import { logger } from 'src/logging/logger';
import * as nodemailer from 'nodemailer';
import { isAfter, isBefore, subDays } from 'date-fns';
import * as schedule from 'node-schedule';


@Injectable()
export class CronJobService {
    constructor(
        @InjectRepository(Membership)
        private readonly membershipRepository: Repository<Membership>,
        private readonly configService: ConfigService,
    ) {}

    @Cron("* * * * *") // Cron job set to run daily every MIDNIGHT!
    async handleCron() {
        logger.info('Cron job triggered');
        const memberships = await this.membershipRepository.find();

        const today = new Date();

        for (const membership of memberships) {
            const dueDate = new Date(membership.dueDate);
            let reminderDate = subDays(dueDate, 7); // 7 days to due date

            // Skip processing if reminder date has passed
            // if (isAfter(today, reminderDate)) {
            //     continue;
            // }

            const email = membership.email;

            let subject: string;
            let message: string;

            if (membership.isFirstMonth) { // if true
                // New Member - Combined Annual and Add-on fees
                subject = `Fitness+ Membership Reminder - ${membership.membershipType}`;

                message = `Dear ${membership.firstName} ${membership.lastName},

Welcome to Fitness+! This email confirms your membership and upcoming payment.
            
This is a reminder for your upcoming service payment. Below are the details:

Membership Type: ${membership.membershipType}
Month: ${today.toLocaleString('default', { month: 'long' })}
Total Amount: $${membership.totalAmount}

This amount includes both your annual membership fee and first month's add-on service charges.

Please make sure to complete the payment to continue enjoying our services.

Here is the link to your invoice for this month's add-on service: http://www.fitnesspluss.com/invoices

Best regards,
Fitness+ Team`

                if (isBefore(today, dueDate) && isBefore(today, reminderDate)) {
                    logger.info(`Sending email to: ${email}`);
                    await this.sendEmail(email, subject, message);
                    logger.info('Sent mail');
                }
            } else if (!membership.isFirstMonth) {
                // Existing member - check for upcoming add-on service charge
                let amount: number;
                if (membership.membershipType) { // Use original membership amount
                    switch (membership.membershipType) {
                        case MembershipType.ANNUAL_BASIC:
                          amount = 500;
                          break;
                        case MembershipType.ANNUAL_PREMIUM:
                          amount = 800;
                          break;
                        case MembershipType.MONTHLY_BASIC:
                          amount = 30;
                          break;
                        case MembershipType.MONTHLY_PREMIUM:
                          amount = 50;
                          break;
                      }
                }
                subject = `Fitness+ Membership Reminder - ${membership.membershipType}`;

                message = `Dear ${membership.firstName} ${membership.lastName},

Welcome to Fitness+! This email confirms your membership upcoming payment.
            
This is a reminder for your upcoming annual membership renewal. Below are the details:

Membership Type: ${membership.membershipType}
Month: ${today.toLocaleString('default', { month: 'long' })}
Total Amount: $${amount}

Please make sure to complete the payment to continue enjoying our services.

Here is the link to your invoice for this month's add-on service: http://www.fitnesspluss.com/invoices

Best regards,
Fitness+ Team`

                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

                // Check if the dueDate falls within current month
                if (isBefore(startOfMonth, dueDate) && isBefore(dueDate, endOfMonth)) {
                    logger.info(`Sending email to: ${email}`);
                    await this.sendEmail(email, subject, message);
                    logger.info('Sent mail');
                }
            }
        }
    }

    // Function to schedule email sending on reminderDate
    private async scheduleEmail(email: string, subject: string, message: string, reminderDate: Date) {
        schedule.scheduleJob(reminderDate, async () => {
            logger.info(`Sending email to: ${email}`);
            await this.sendEmail(email, subject, message);
            logger.info('Email sent successfully');
        });
    }

    // Function to send membership emails
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