import {Interfaces} from '../Interfaces';
import CommandInterface = Interfaces.CommandInterface;

export default (property: { [property: string]: any }, multiple?: { [property: string]: any }) => (
    target: any, propertyKey: string,
) => {
    const metadata: CommandInterface = Reflect.getOwnMetadata('command', target, propertyKey) || {};

    if (typeof property === 'object') {
        metadata.Types = Object.assign({}, metadata.Types, property);
    }

    Reflect.defineMetadata('command', metadata, target, propertyKey);
};
