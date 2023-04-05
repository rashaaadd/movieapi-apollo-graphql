import { Entity, Column, BaseEntity, OneToMany, PrimaryGeneratedColumn  } from 'typeorm';
import { Movie } from './Movie';
import { Review } from './Review';

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column('text',{nullable:true, unique:true})
    username: string

    @Column('text',{nullable:true, unique:true})
    email: string

    @Column('text',{nullable:true})
    password: string 
}