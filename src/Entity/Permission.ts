import {BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn} from 'typeorm';

export enum PermissionType {
    User = 1,
    Role = 2,
}

@Entity('Permission')
export class Permission extends BaseEntity {
    public static PermissionType = PermissionType;

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({type: 'bigint'}) @Index('guild', ['GuildID'])
    public guildId: string;

    @Column({length: 512}) @Index('node', ['node'])
    public node: string;

    @Column() @Index('type', ['type'])
    public type: PermissionType;

    @Column({type: 'bigint'}) @Index('type_id', ['typeId'])
    public typeId: string;

    @Column() @Index('allowed', ['allowed'])
    public allowed: boolean = true;

    public constructor(init?: Partial<Permission>) {
        super();
        Object.assign(this, init);
    }
}

export default Permission;
