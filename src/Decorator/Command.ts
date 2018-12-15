import {Interfaces} from '../Interfaces';
import CommandInterface = Interfaces.CommandInterface;

export default (name: string, shortDescription?: string, longDescription?: string) => {
    return (target: any, propertyKey: string) => {
        const metadata: CommandInterface = Reflect.getOwnMetadata('command', target, propertyKey) || {};

        if (Array.isArray(metadata.Aliases)) {
            metadata.Aliases.unshift(name);
        } else {
            metadata.Aliases = [name];
        }

        metadata.ShortDescription = shortDescription;
        metadata.LongDescription  = longDescription || shortDescription;

        Reflect.defineMetadata('command', metadata, target, propertyKey);
    };
};
