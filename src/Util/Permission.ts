import {Constants, GuildChannel, Member, PermissionOverwrite} from 'eris';

/**
 * Abstract as a hack to make this class static use only
 * @see https://github.com/DV8FromTheWorld/JDA/blob/master/src/main/java/net/dv8tion/jda/core/utils/PermissionUtil.java
 */
export default abstract class Permission {
    public static getEffectivePermission(member: Member, channel?: GuildChannel): number {
        const guild = member.guild;
        let permission: number;
        if (!channel) {
            if (guild.ownerID === member.id) {
                return Constants.Permissions.all;
            }
            permission = guild.roles.get(guild.id).permissions.allow;
            for (const roleId of member.roles.values()) {
                const role = guild.roles.get(roleId);
                permission |= role.permissions.allow;
                if (Permission.isApplied(permission, Constants.Permissions.administrator)) {
                    return Constants.Permissions.all;
                }
            }

            return permission;
        }

        if (channel.guild.id !== member.guild.id) {
            throw new Error('Provided channel and provided member are not of the same guild!');
        }

        if (guild.ownerID === member.id) {
            return Constants.Permissions.all;
        }

        permission = this.getEffectivePermission(member);
        if (Permission.isApplied(permission, Constants.Permissions.administrator)) {
            return Constants.Permissions.all;
        }

        const {allow, deny} = Permission.getExplicitOverrides(channel, member);
        permission = Permission.apply(permission, allow, deny);

        return Permission.isApplied(permission, Constants.Permissions.readMessages) ? permission : 0;
    }

    private static getExplicitOverrides(channel: GuildChannel, member: Member): {allow: number, deny: number} {
        let allow: number = 0;
        let deny: number  = 0;

        let override: PermissionOverwrite = channel.permissionOverwrites.get(channel.guild.id);
        if (override) {
            allow = override.allow;
            deny  = override.deny;
        }

        let allowRole: number = 0;
        let denyRole: number  = 0;
        for (const roleId of member.roles.values()) {
            const role = channel.guild.roles.get(roleId);
            override   = channel.permissionOverwrites.get(role.id);
            if (override) {
                allowRole |= override.allow;
                denyRole |= override.deny;
            }
        }

        allow = (allow & ~denyRole) | allowRole;
        deny  = (deny & ~allowRole) | denyRole;

        override = channel.permissionOverwrites.get(member.id);
        if (override) {
            const memberAllow = override.allow;
            const memberDeny  = override.deny;
            allow             = (allow & ~memberDeny) | memberAllow;
            deny              = (deny & ~memberAllow) | memberDeny;
        }

        return {allow, deny};
    }

    private static isApplied(permissions: number, perms: number): boolean {
        return (permissions & perms) === perms;
    }

    private static apply(permission: number, allow: number, deny: number): number {
        permission &= ~deny; // Deny Everything that the cascade of roles denied
        permission |= allow; // Allow all the things that the cascade of roles allowed (allowed overrides denied)

        return permission;
    }
}
