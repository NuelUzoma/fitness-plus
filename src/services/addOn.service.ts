import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddOnService } from 'src/database/addOnService.entity';
import { CreateAddonDto } from 'src/dto/create-addon.dto';


@Injectable()
export class AddOnServices {
    constructor(
        @InjectRepository(AddOnService)
        private readonly addOnServiceRepository: Repository<AddOnService>,
    ) {}

    async create(createAddonDto: CreateAddonDto): Promise<AddOnService> {
        // return this.addOnServiceRepository.save(addOnService);
        const addOnService = new AddOnService();
        // addOnService.membershipId = userId To be implented with login function
        addOnService.serviceName = createAddonDto.serviceName;

        // Set monthly amount and dueDate automatically
        addOnService.setDatesandAmounts();

        return this.addOnServiceRepository.save(addOnService);
    }

    async findAll(): Promise<AddOnService[]> {
        return this.addOnServiceRepository.find({ relations: ['membership'] });
    }

    async clearAddOnServices() {
        try {
            await this.addOnServiceRepository.delete({}); // Delete all records
            console.log('Add-on services cleared successfully');
        } catch (error) {
            console.error("Error clearing add-on services:", error);
        }
    }
}