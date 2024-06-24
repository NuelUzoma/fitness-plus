import { IsEmail, IsEnum, IsNotEmpty, IsBoolean, ValidateNested, IsArray } from 'class-validator';
import { Membership, MembershipType } from 'src/database/membership.entity';
import { CreateAddonDto } from './create-addon.dto';
import { Type } from 'class-transformer';

// Data Transfer Object expected by the application
export class CreateMembershipDto {
    @IsNotEmpty()
    firstName: string;
  
    @IsNotEmpty()
    lastName: string;

    // @IsStrongPassword()
    // password: string;
  
    @IsEnum(MembershipType)
    membershipType: MembershipType;
  
    // @IsNumber()
    // totalAmount: number;
  
    @IsEmail()
    email: string;
  
    @IsBoolean()
    isFirstMonth: boolean;

    @ValidateNested({ each: true })
    @Type(() => CreateAddonDto)
    @IsArray()
    addOnServices: CreateAddonDto[];
}

export class CreateMembershipResponseDto {
    authorizationUrl: string;
    membership: Membership
};