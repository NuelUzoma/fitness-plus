import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from 'src/database/membership.entity';
import { CreateMembershipDto } from 'src/dto/create-membership.dto';


@Injectable()
export class MembershipService {
    constructor(
        @InjectRepository(Membership)
        private readonly membershipRepository: Repository<Membership>,
    ) {}

    async create(createMembershipDto: CreateMembershipDto): Promise<Membership> {
        const membership = new Membership();
        membership.firstName = createMembershipDto.firstName;
        membership.lastName = createMembershipDto.lastName;
        membership.membershipType = createMembershipDto.membershipType;
        membership.email = createMembershipDto.email;
        membership.isFirstMonth = createMembershipDto.isFirstMonth;

        // Set dates and amount automatically
        membership.setDatesandAmount();
        
        return this.membershipRepository.save(membership);
    }

    async findAll(): Promise<Membership[]> {
        return this.membershipRepository.find({ relations: ['addOnServices'] });
    }

    async findById(id: number): Promise<Membership> {
        return this.membershipRepository.findOne({ where: {id}});
    }

    async update(id: number, updateMembershipDto: CreateMembershipDto): Promise<Membership> {
        await this.membershipRepository.update(id, updateMembershipDto);
        return this.findById(id);
    }

    async remove(id: number): Promise<void> {
        await this.membershipRepository.delete(id);
    }
}