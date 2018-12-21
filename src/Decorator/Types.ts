import {Interfaces} from '../Interfaces';

export default (property: { [property: string]: any }, multiple?: { [property: string]: any }) => (
    target: any, propertyKey: string,
) => {
    const metadata: Interfaces.CommandInterface = Reflect.getOwnMetadata('command', target, propertyKey) || {};

    if (typeof property === 'object') {
        metadata.types = Object.assign({}, metadata.types, property);
    }

    Reflect.defineMetadata('command', metadata, target, propertyKey);
};
