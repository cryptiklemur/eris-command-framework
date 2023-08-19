import {Interfaces} from '../Interfaces';

export interface PermissionOptions {
    node?: string;
    noWildcards?: boolean;
    owner?: boolean;
    permission?: bigint;
    botOwner?: boolean;
}

export default (optionsOrNode: string | PermissionOptions, noWildcards?: boolean) => (
    target: any,
    propertyKey: string,
) => {
    const metadata: Interfaces.CommandInterface = Reflect.getOwnMetadata('command', target, propertyKey) || {};

    if (typeof optionsOrNode === 'string') {
        metadata.permissionNode   = optionsOrNode;
        metadata.permissionStrict = noWildcards || false;
    } else {
        metadata.permissionOptions = optionsOrNode;
    }

    Reflect.defineMetadata('command', metadata, target, propertyKey);
};
