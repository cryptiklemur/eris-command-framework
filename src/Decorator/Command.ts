import {Interfaces} from '../Interfaces';

export default (name: string, shortDescription?: string, longDescription?: string) => {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    return (target: any, propertyKey: string): void => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument
        const metadata: Interfaces.CommandInterface = Reflect.getOwnMetadata('command', target, propertyKey) || {};

        if (Array.isArray(metadata.aliases)) {
            metadata.aliases.unshift(name);
        } else {
            metadata.aliases = [name];
        }

        metadata.shortDescription = shortDescription;
        metadata.longDescription  = longDescription || shortDescription;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        Reflect.defineMetadata('command', metadata, target, propertyKey);
    };
};
