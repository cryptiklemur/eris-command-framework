import {Interfaces} from '../Interfaces';
import CommandInterface = Interfaces.CommandInterface;

export default (node: string, noWildcards: boolean = false) => (target: any, propertyKey: string) => {
    const metadata: CommandInterface = Reflect.getOwnMetadata('command', target, propertyKey) || {};

    metadata.PermissionNode   = node;
    metadata.PermissionStrict = noWildcards;

    Reflect.defineMetadata('command', metadata, target, propertyKey);
};
