import {Interfaces} from '../Interfaces';

export interface PermissionOptions {
    node?: string;
    noWildcards?: boolean;
    owner?: boolean;
    permission?: bigint;
    botOwner?: boolean;
}

export default (optionsOrNode: string | PermissionOptions, noWildcards?: boolean) => (
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    target: any,
    propertyKey: string,
): void => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument
    const metadata: Interfaces.CommandInterface = Reflect.getOwnMetadata('command', target, propertyKey) || {};

    if (typeof optionsOrNode === 'string') {
        metadata.permissionNode   = optionsOrNode;
        metadata.permissionStrict = noWildcards || false;
    } else {
        metadata.permissionOptions = optionsOrNode;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Reflect.defineMetadata('command', metadata, target, propertyKey);
};
