import {
    Entity,
    Column,
    BeforeInsert,
    Index,
    OneToMany
} from 'typeorm'
import model from './model.entity';
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { Post } from './posts.entity';

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
    
    toJson() {
        return {
            ...this,
            password: undefined, 
            verified: undefined, 
            verificationCode: undefined, 
        }
    }
}