import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Movie extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column('text',{nullable:false})
    movieName!: string

    @Column('text',{nullable:false})
    description!: string

    @Column('text',{nullable:false})
    directorName!: string

    @Column('date',{nullable:false})
    releaseDate!: Date

    @Column('int',{nullable:true})
    creatorId!: number
}