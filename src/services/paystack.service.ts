import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class PaystackService {
    private readonly paystackSecretKey: string;

    constructor(private readonly configService: ConfigService) {
        this.paystackSecretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY');
    }

    async initializeTransaction(amount: number, email: string): Promise<any> {
        const url = 'https://api.paystack.co/transaction/initialize';
        const data = {
            email,
            amount: amount * 100,
            currency: 'NGN'
        };

        try {
            const response = await axios.post(url, data, {
                headers: {
                    Authorization: `Bearer ${this.paystackSecretKey}`,
                    "Content-Type": "application/json"
                },
            });
            return response.data;
        } catch (error) {
            throw new HttpException(
                `Error Initilizing Transaction: ${error}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async verifyTransaction(reference: string): Promise<any> {
        const url = `https://api.paystack.co/transaction/verify/${reference}`;

        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${this.paystackSecretKey}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            throw new HttpException(
                `Error Initilizing Transaction: ${error}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
