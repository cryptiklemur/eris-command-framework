import {Interfaces} from '../Interfaces';

export default (node: string, noWildcards: boolean = false) => (target: any, propertyKey: string) => {
    const metadata: Interfaces.CommandInterface = Reflect.getOwnMetadata('command', target, propertyKey) || {};

    metadata.permissionNode   = node;
    metadata.permissionStrict = noWildcards;

    Reflect.defineMetadata('command', metadata, target, propertyKey);
};
