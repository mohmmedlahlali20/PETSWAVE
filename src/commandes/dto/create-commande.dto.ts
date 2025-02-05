import { IsMongoId, IsNotEmpty, IsNumber } from "class-validator";

export interface status {
    Pending: 'pending',
    InProgress: 'in progress',
    Completed: 'completed',
    Cancelled: 'cancelled'
}

export class CreateCommandeDto {
    @IsMongoId()
    @IsNotEmpty()
    petsId: string


    @IsMongoId()
    @IsNotEmpty()
    userId: string


    @IsNotEmpty()
    status: status

    @IsNotEmpty()
    orderDate: Date 

    @IsNotEmpty()
    @IsNumber()
    totalAmount: number




}
