import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Membership } from 'src/membership/entity/membership.entity';
import { AddOnService } from 'src/addOnServices/entity/addOnService.entity';
import { CreateMembershipDto } from 'src/membership/dto/create-membership.dto';
import { logger } from 'src/logging/logger';


@Injectable()
export class MembershipService {
    constructor(
        @InjectRepository(Membership)
        private readonly membershipRepository: Repository<Membership>,
        @InjectRepository(AddOnService)
        private readonly addOnServiceRepository: Repository<AddOnService>,
        private readonly dataSource: DataSource,
    ) {}

    async create(createMembershipDto: CreateMembershipDto): Promise<Membership> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const membership = new Membership();
            membership.firstName = createMembershipDto.firstName;
            membership.lastName = createMembershipDto.lastName;
            // membership.password = createMembershipDto.password;
            membership.membershipType = createMembershipDto.membershipType;
            membership.email = createMembershipDto.email;
            membership.isFirstMonth = createMembershipDto.isFirstMonth;

            // Set dates and amount automatically
            membership.setDatesandAmount();

            // Save the new total amount in the database
            let total = membership.totalAmount;

            await queryRunner.manager.save(membership);

            if (createMembershipDto.addOnServices && createMembershipDto.addOnServices.length > 0) {
                for(const addOnDto of createMembershipDto.addOnServices) {
                    addOnDto.membershipId = membership.id;
                    const addOnService = this.addOnServiceRepository.create({
                        ...addOnDto,
                        membership: membership
                    });
                    
                    addOnService.setDatesandAmounts(); // Set date and amount automatically
                    
                    await queryRunner.manager.save(addOnService);
                    total += addOnService.monthlyAmount;
                }

                // Update membership amount using query builder
                const updateResult = await queryRunner.manager
                    .createQueryBuilder()
                    .update(Membership)
                    .set({ totalAmount: total })
                    .where("id = :id", { id: membership.id })
                    .execute();
                
                logger.info('Membership update result: ', updateResult);
            } else {
                // Update membership total amount if no add-on is included (optional)
                // membership.totalAmount = total;
                console.log('Final: ', membership.totalAmount);
                await queryRunner.manager.save(membership);
            }

            // Commit transaction
            await queryRunner.commitTransaction();

            const updatedMembership = await this.membershipRepository.findOne({
                where: {
                    id: membership.id
                }
            });

            return updatedMembership;
        } catch (err) {
            // Rollback transaction incase of error
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            // Release the query runner
            await queryRunner.release();
        }
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