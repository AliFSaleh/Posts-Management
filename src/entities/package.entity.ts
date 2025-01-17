import { Entity, Column, ManyToMany, OneToMany } from "typeorm";
import model from './model.entity'
import { User } from "./users.entity";
import { Subscription } from "./subscription.entity";


@Entity()
export class Package extends model {
    @Column()
    title: string

    @Column()
    days: number

    @Column()
    price: number

    @OneToMany(() => Subscription, subscriptions => subscriptions.package)
    subscriptions: Subscription[];
}