import { IsEnum } from 'class-validator';
import { ServiceName } from 'src/database/addOnService.entity';

export class CreateAddonDto {
    // @IsNumber(userId)
    // membershipId: userId // To be implemented with Login Implementation

    @IsEnum(ServiceName)
    serviceName: ServiceName
}