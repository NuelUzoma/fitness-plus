import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { Membership } from 'src/database/membership.entity';
import { MembershipService } from 'src/services/membership.service';
import { CreateMembershipDto } from 'src/dto/create-membership.dto';


@Controller('/api/memberships')
export class MembershipController {
    constructor(private readonly membershipService: MembershipService) {}

    @Post() // POST Request to create/signup a member
    async create(@Body() createMembershipDto: CreateMembershipDto): Promise<Membership> {
        return this.membershipService.create(createMembershipDto);
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