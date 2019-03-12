import {GuildChannel, Member, User} from 'eris';
import {inject, injectable, optional} from 'inversify';
import {Connection} from 'typeorm';
import {Logger as LoggerInstance} from 'winston';
import CommandContext from '../CommandContext';
import Configuration from '../Configuration';

import Permission, {PermissionType} from '../Entity/Permission';
import CommandInfo from '../Info/CommandInfo';
import TYPES from '../types';
import PermissionUtil from '../Util/Permission';

enum Allowed {
    No      = -1,
    Unknown = 0,
    Yes     = 1,
}

@injectable()
export default class Authorizer {
    private static DoesPermissionMatch(permission: string, node: string, strict: boolean): boolean {
        return (!strict && node.indexOf('*') >= 0 && Authorizer.IsWildcardMatch(permission, node))
               || node === permission;
    }

    private static IsWildcardMatch(permission: string, node: string): boolean {
        const permArray: string[] = permission.split('.');
        const nodeArray: string[] = node.split('.');

        for (let i = 0; i < nodeArray.length; i++) {
            if (nodeArray[i] === permArray[i] || nodeArray[i] === '*') {
                continue;
            }

            return false;
        }

        return true;
    }

    @inject(TYPES.configuration)
    private configuration: Configuration;

    @inject(TYPES.connection)
    @optional()
    private database: Connection;

    @inject(TYPES.logger)
    private logger: LoggerInstance;

    private readonly backdoor: String[];

    private permissions: Permission[] = [];

    public constructor() {
        this.backdoor = process.env.BACKDOOR_USERS ? process.env.BACKDOOR_USERS.split(',') : [];
    }

    public async initialize(): Promise<void> {
        if (!this.database) {
            this.logger.warn('No database connection, not loading permissions from the DB');

            return;
        }

        try {
            this.permissions = await this.database.getRepository(Permission).find();
        } catch (error) {
            this.logger.error('Failed fetching permissions: %O', error);
        }
    }

    public isAuthorized(
        context: CommandContext,
        command: CommandInfo,
        member: Member | User,
        strict: boolean,
    ): boolean {
        if (!command.permissionNode && Object.keys(command.permissionOptions).length === 0) {
            return true;
        }

        if (!member) {
            return false;
        }

        if (this.backdoor.indexOf(member.id) >= 0) {
            return true;
        }

        if (command.permissionOptions.botOwner) {
            return this.configuration.owners.includes(member.id);
        }

        let hasPerms: boolean = false;

        if (member instanceof Member) {
            const roles: string[] = member.roles;
            roles.push(member.guild.id);
            for (let roleId of roles) {
                if (command.permissionNode) {
                    let allowed: number = this.isRoleAllowed(command.permissionNode, roleId, strict);
                    if (allowed === Allowed.No) {
                        return false;
                    } else if (allowed === Allowed.Yes) {
                        hasPerms = true;
                    }
                }

                if (command.permissionOptions.owner) {
                    return member.guild.ownerID === member.id;
                }

                if (command.permissionOptions.permission) {
                    return PermissionUtil.hasPermission(
                        command.permissionOptions.permission,
                        member,
                        context.guild ? context.channel as GuildChannel : undefined,
                    );
                }
            }
        }

        if (command.permissionOptions.owner) {
            return false;
        }
        if (command.permissionOptions.permission) {
            return false;
        }

        if (command.permissionNode) {
            let allowed: number = this.isUserAllowed(command.permissionNode, member, strict);
            if (allowed === Allowed.No) {
                return false;
            } else if (allowed === Allowed.Yes) {
                hasPerms = true;
            }
        }

        return hasPerms;
    }

    private isRoleAllowed(permission: string, roleId: string, strict: boolean): Allowed {
        const perms: ReadonlyArray<Permission> = this.permissions.filter(
            (x) => x.type === PermissionType.Role && x.typeId === roleId,
        );

        for (let perm of perms) {
            if (Authorizer.DoesPermissionMatch(permission, perm.node, strict)) {
                return perm.allowed ? Allowed.Yes : Allowed.No;
            }
        }

        return Allowed.Unknown;
    }

    private isUserAllowed(permission: string, member: Member | User, strict: boolean): Allowed {
        let perms: ReadonlyArray<Permission>;
        if (member instanceof Member) {
            perms = this.permissions.filter(
                (x) => x.type === PermissionType.User
                       && x.typeId === member.id && x.guildId === member.guild.id,
            );
        } else {
            perms = this.permissions.filter(
                (x) => x.type === PermissionType.User
                       && x.typeId === member.id && !x.guildId,
            );
        }

        if (perms.length === 0) {
            return Allowed.Unknown;
        }

        for (let perm of perms) {
            if (Authorizer.DoesPermissionMatch(permission, perm.node, strict)) {
                return perm.allowed ? Allowed.Yes : Allowed.No;
            }
        }

        return Allowed.Unknown;
    }
}
