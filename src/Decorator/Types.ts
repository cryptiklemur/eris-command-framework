import {Interfaces} from '../Interfaces';

export default (property: { [property: string]: any }) => (
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    target: any, propertyKey: string,
): void => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument
    const metadata: Interfaces.CommandInterface = Reflect.getOwnMetadata('command', target, propertyKey) || {};

    if (typeof property === 'object') {
        metadata.types = Object.assign({}, metadata.types, property);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Reflect.defineMetadata('command', metadata, target, propertyKey);
};
