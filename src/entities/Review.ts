import { Entity, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Review extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column('int',{nullable:false})
    movieId!: number

    @Column('int',{nullable:false})
    userId!: number

    @Column('decimal',{nullable:false})
    rating: number 

    @Column('text',{nullable:false})
    comment: string  

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}