import {Entity, Column, PrimaryGeneratedColumn, JoinColumn} from 'typeorm'
import model from './model.entity'
import { User } from './users.entity'
import { Package } from './package.entity'

@Entity()
export class Subscription extends model{
    @Column()
    user_id: string

    @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
    user: User

    @Column()
    package_id: string
    
    @JoinColumn({name: 'package_id', referencedColumnName: 'id'})
    package: Package

    @Column()
    start_date: Date

    @Column()
    end_date: Date
}