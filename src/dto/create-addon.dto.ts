import { IsEnum, IsNumber } from 'class-validator';
import { ServiceName } from 'src/database/addOnService.entity';

export class CreateAddonDto {
    @IsNumber()
    membershipId: number; // To be implemented with Login Implementation

    @IsEnum(ServiceName)
    serviceName: ServiceName;
}