import { Person } from './utils/Person';
import { Transaction } from './Transaction';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Banker } from './Banker';

@Entity('client')
export class Client extends Person {
    @PrimaryColumn()
    @Column({
        type: 'numeric',
    })
    balance!: number;

    @Column({
        default: true,
        name: 'active',
    })
    is_active!: boolean;

    @Column({
        type: 'simple-json',
        nullable: true,
    })
    additional_info!: {
        age: number;
        hair_color: string;
    };

    @Column({
        type: 'simple-array',
        default: [],
    })
    family_members!: string[];

    @OneToMany(() => Transaction, (transaction) => transaction.client)
    transactions!: Transaction[];

    @ManyToMany(() => Banker)
    bankers!: Banker[];

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}
