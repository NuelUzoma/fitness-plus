import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { Membership } from 'src/database/membership.entity';
import { MembershipService } from 'src/services/membership.service';
import { CreateMembershipDto, CreateMembershipResponseDto } from 'src/dto/create-membership.dto';
import { PaystackService } from 'src/services/paystack.service';
import { logger } from 'src/logging/logger';


@Controller('/api/memberships')
export class MembershipController {
    constructor(
        private readonly membershipService: MembershipService,
        private readonly paystackService: PaystackService,
    ) {}

    @Post() // POST Request to create/signup a member
    async create(@Body() createMembershipDto: CreateMembershipDto): Promise<CreateMembershipResponseDto> {
        const membership =  await this.membershipService.create(createMembershipDto);

        // Calculate the total amount including the addOn service charge
        const totalAmount = membership.totalAmount; // Using the updated total Amount
        console.log('Paystack Amount: ', totalAmount);

        try {
            // Initialize Paystack Transaction
            const transaction = await this.paystackService.initializeTransaction(totalAmount, createMembershipDto.email);

            // Return the authorization url for redirection
            return {
                authorizationUrl: transaction.data.authorization_url,
                membership
            }
        } catch (error) {
            logger.error("Error initializing Paystack transaction:", error);
        }
    }

    @Post('verify')
    async verifyTransaction(@Body() verifyDto: { reference: string}) {
        return this.paystackService.verifyTransaction(verifyDto.reference);
    }

    @Get() // GET Request to retrieve all members
    async findAll(): Promise<Membership[]> {
        return this.membershipService.findAll();
    }

    @Get(':id') // Retrieve a member by its ID
    async findById(@Param('id') id: number): Promise<Membership> {
        return this.membershipService.findById(id);
    }

    @Put(':id') // UPDATE member details
    async update(@Param('id') id: number, @Body() updateMembershipDto: CreateMembershipDto): Promise<Membership> {
        return this.membershipService.update(id, updateMembershipDto);
    }

    @Delete(':id') // Delete  a member from the database
    async remove(@Param('id') id: number): Promise<void> {
        return this.membershipService.remove(id);
    }
}