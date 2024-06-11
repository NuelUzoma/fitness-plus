import { IsEmail, IsEnum, IsNotEmpty, IsBoolean, IsNumber } from 'class-validator';
import { MembershipType } from 'src/database/membership.entity';

// Data Transfer Object expected by the application
export class CreateMembershipDto {
    @IsNotEmpty()
    firstName: string;
  
    @IsNotEmpty()
    lastName: string;
  
    @IsEnum(MembershipType)
    membershipType: MembershipType;
  
    @IsNumber()
    totalAmount: number;
  
    @IsEmail()
    email: string;
  
    @IsBoolean()
    isFirstMonth: boolean;
}