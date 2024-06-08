import {
    Entity,
    Column,
    BeforeInsert,
    Index,
    OneToMany,
    ManyToMany,
    MoreThan
} from 'typeorm'
import model from './model.entity';
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { Post } from './posts.entity';
import { Package } from './package.entity';
import { Subscription } from './subscription.entity';
import { AppDataSource } from '../utils/data-source';

export enum RoleEnumType {
    USER = 'user',
    ADMIN = 'admin'
}

@Entity()
export class User extends model {
    @Column()
    name: string

    @Index('email_index')
    @Column({
        unique: true
    })
    email: string

    @Column()
    password: string

    @Column({
        type: 'enum',
        enum: RoleEnumType,
        default: RoleEnumType.USER
    })
    role: RoleEnumType.USER

    @Column({
        default: 'default.png',
    })
    photo: string;

    @Column({
        default: false
    })
    verified: boolean

    @Column({
        type: 'text',
        nullable: true,
    })
    verificationCode!: string | null

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[]

    @OneToMany(() => Subscription, subscriptions => subscriptions.user)
    subscriptions: Subscription[];

    @BeforeInsert()
    async hasPassword(){
        this.password = await bcrypt.hash(this.password, 12);
    }

    static async comparePassword(
        candidatePassword: string,
        hashedPassword: string
    ) {
        return await bcrypt.compare(candidatePassword, hashedPassword);
    }

    static createVerificationCode () {
        const verificationCode = crypto.randomBytes(32).toString('hex');

        const hashedVerificationCode = crypto
            .createHash('sha256')
            .update(verificationCode)
            .digest('hex')

        return { verificationCode, hashedVerificationCode };
    }

    static async activeSubscription (userId: string) {
        const subscriptionRepository = AppDataSource.getRepository(Subscription)
        const milliseconds = Date.now();

        const start_date = new Date(milliseconds);
        
        const year = start_date.getFullYear();
        const month = start_date.getMonth() + 1;
        const day = start_date.getDate();
        
        const today = `${year}-${month}-${day}`;
        const test = new Date (today)

        return await subscriptionRepository.findOne({
            where: {
                user_id: userId,
                end_date: MoreThan(start_date)
            }
        })
    }
    
    toJson() {
        return {
            ...this,
            password: undefined, 
            verified: undefined, 
            verificationCode: undefined, 
        }
    }
}