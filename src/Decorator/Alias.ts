import {Interfaces} from '../Interfaces';

export default (...aliases: string[]) => (target: any, propertyKey: string) => {
    const metadata: Interfaces.CommandInterface = Reflect.getOwnMetadata('command', target, propertyKey) || {};

    if (Array.isArray(metadata.aliases)) {
        metadata.aliases.concat(aliases);
    } else {
        metadata.aliases = aliases;
    }

    Reflect.defineMetadata('command', metadata, target, propertyKey);
};
