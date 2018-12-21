import {Interfaces} from '../Interfaces';

export default () => (target: any, propertyKey: string, parameterIndex: number) => {
    const metadata: Interfaces.CommandInterface = Reflect.getOwnMetadata('command', target, propertyKey) || {};

    metadata.remainderField = parameterIndex;

    Reflect.defineMetadata('command', metadata, target, propertyKey);
};
