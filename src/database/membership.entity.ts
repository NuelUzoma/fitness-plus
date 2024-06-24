import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { AddOnService } from './addOnService.entity';

export enum MembershipType { // Enumerator for membership types
    ANNUAL_BASIC = 'Annual Basic',
    MONTHLY_BASIC = 'Monthly Basic',
    ANNUAL_PREMIUM = 'Annual Premium',
    MONTHLY_PREMIUM = 'Monthly Premium',
}

@Entity()
export class Membership {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    // @Column()
    // password: string;

    @Column({
        type: "enum",
        enum: MembershipType
    })
    membershipType: string

    @Column({
        type: "date"
    })
    startDate: Date

    @Column({
        type: "date"
    })
    dueDate: Date

    @Column('float')
    totalAmount: number;

    @Column({
        unique: true
    })
    email: string

    @Column({
        default: false
    })
    isFirstMonth: boolean

    @OneToMany(() => AddOnService, addOnService => addOnService.membership, { cascade: true })
    addOnServices: AddOnService[];


    // Method to set the startDate, dueDate and totalAmount due to membershipType
    setDatesandAmount() {
        this.startDate = new Date(); // Set start date as current date

        if (this.membershipType === MembershipType.ANNUAL_BASIC) {
            this.dueDate = new Date(this.startDate.getFullYear()+1, this.startDate.getMonth(), this.startDate.getDate());
            this.totalAmount = 500;
        } else if (this.membershipType === MembershipType.ANNUAL_PREMIUM) {
            this.dueDate = new Date(this.startDate.getFullYear()+1, this.startDate.getMonth(), this.startDate.getDate());
            this.totalAmount = 800;
        } else if (this.membershipType === MembershipType.MONTHLY_BASIC) {
            this.dueDate = new Date(this.startDate.getFullYear(), this.startDate.getMonth()+1, this.startDate.getDate());
            this.totalAmount = 30;
        } else if (this.membershipType === MembershipType.MONTHLY_PREMIUM) {
            this.dueDate = new Date(this.startDate.getFullYear(), this.startDate.getMonth()+1, this.startDate.getDate());
            this.totalAmount = 50;
        }
    }
}