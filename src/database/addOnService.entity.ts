import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Membership } from './membership.entity';


export enum ServiceName { // ENumerator for service names
    PERSONAL_TRAINING = 'Personal Training',
    TOWEL_RENTALS = 'Towel Rentals'
}

@Entity()
export class AddOnService {
    @PrimaryGeneratedColumn()
    id: number;

    // @Column()
    // membershipId: number;

    @Column({
        type: "enum",
        enum: ServiceName
    })
    serviceName: string

    @Column('float')
    monthlyAmount: number;

    @Column({
        type: "date"
    })
    dueDate: Date

    @ManyToOne(() => Membership, membership => membership.addOnServices)
    membership: Membership; // Many-To-One relationship with members


    // Method to set the startDate, dueDate and totalAmount due to membershipType
    setDatesandAmounts() {
        const currentDate = new Date(); // Retrieve the current date
        
        if (this.serviceName === ServiceName.PERSONAL_TRAINING) {
            this.dueDate = new Date(currentDate.getFullYear(), currentDate.getMonth()+1, currentDate.getDate());
            this.monthlyAmount = 100;
        } else if (this.serviceName === ServiceName.TOWEL_RENTALS) {
            this.dueDate = new Date(currentDate.getFullYear(), currentDate.getMonth()+1, currentDate.getDate());
            this.monthlyAmount = 20;
        }
    }
}