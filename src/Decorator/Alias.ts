import {Interfaces} from '../Interfaces';
import CommandInterface = Interfaces.CommandInterface;

export default (...aliases: string[]) => (target: any, propertyKey: string) => {
    const metadata: CommandInterface = Reflect.getOwnMetadata('command', target, propertyKey) || {};

    if (Array.isArray(metadata.Aliases)) {
        metadata.Aliases.concat(aliases);
    } else {
        metadata.Aliases = aliases;
    }

    Reflect.defineMetadata('command', metadata, target, propertyKey);
};
