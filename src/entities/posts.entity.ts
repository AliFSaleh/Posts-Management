import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import model from "./model.entity";
import { User } from "./users.entity";


@Entity()
export class Post extends model {
    @Column({
        unique: true
    })
    title: string

    @Column()
    content: string

    @Column({
        default: 'default-post.png'
    })
    image: string

    @ManyToOne(() => User, (user) => user.posts)
    @JoinColumn()
    user: User
}