import {Interfaces} from '../Interfaces';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (...aliases: string[]) => (target: any, propertyKey: string): void => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument
    const metadata: Interfaces.CommandInterface = Reflect.getOwnMetadata('command', target, propertyKey) || {};

    if (Array.isArray(metadata.aliases)) {
        metadata.aliases.concat(aliases);
    } else {
        metadata.aliases = aliases;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Reflect.defineMetadata('command', metadata, target, propertyKey);
};
