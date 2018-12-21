import {Interfaces} from '../Interfaces';

export default (name: string, shortDescription?: string, longDescription?: string) => {
    return (target: any, propertyKey: string) => {
        const metadata: Interfaces.CommandInterface = Reflect.getOwnMetadata('command', target, propertyKey) || {};

        if (Array.isArray(metadata.aliases)) {
            metadata.aliases.unshift(name);
        } else {
            metadata.aliases = [name];
        }

        metadata.shortDescription = shortDescription;
        metadata.longDescription  = longDescription || shortDescription;

        Reflect.defineMetadata('command', metadata, target, propertyKey);
    };
};
