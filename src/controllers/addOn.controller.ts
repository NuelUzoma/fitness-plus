import { Controller, Get, Post, Body } from '@nestjs/common';
import { AddOnService } from 'src/database/addOnService.entity';
import { AddOnServices } from 'src/services/addOn.service';
import { CreateAddonDto } from 'src/dto/create-addon.dto';


@Controller('/api/addons')
export class AddOnServiceController {
    constructor(private readonly addOnServices: AddOnServices) {}

    @Post() // POST Request to create addons
    async create(@Body() createAddOnDto: CreateAddonDto): Promise<AddOnService> {
        return this.addOnServices.create(createAddOnDto);
    }

    @Get() // GET Request to retrieve all addons from DB
    async findAll(): Promise<AddOnService[]> {
        return this.addOnServices.findAll();
    }
}