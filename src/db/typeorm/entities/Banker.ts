import { Person } from './utils/Person';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    UpdateDateColumn,
} from 'typeorm';
import { Client } from './Client';

@Entity('banker')
export class Banker extends Person {
    @Column({
        unique: true,
    })
    employee_number!: string;

    @ManyToMany(() => Client)
    @JoinTable({
        name: 'bankers_clients',
        joinColumn: {
            name: 'banker',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'client',
            referencedColumnName: 'id',
        },
    })
    clients!: Client[];

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}
