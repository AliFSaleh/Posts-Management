import {Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne} from 'typeorm'
import model from './model.entity'
import { User } from './users.entity'
import { Package } from './package.entity'

@Entity()
export class Subscription extends model{
    @ManyToOne(() => User, user => user.subscriptions)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Package, related_package => related_package.subscriptions)
    @JoinColumn({ name: 'package_id' })
    package: Package;

    @Column('uuid')
    user_id: string;

    @Column('uuid')
    package_id: string;

    @Column()
    start_date: Date

    @Column()
    end_date: Date
}