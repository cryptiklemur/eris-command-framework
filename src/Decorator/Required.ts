import {Interfaces} from '../Interfaces';

export default (target: any, propertyKey: string, parameterIndex: number) => {
    const metadata: Interfaces.CommandInterface = Reflect.getOwnMetadata('command', target, propertyKey) || {};

    if (!Array.isArray(metadata.requiredFields)) {
        metadata.requiredFields = [];
    }

    metadata.requiredFields.push(parameterIndex);

    Reflect.defineMetadata('command', metadata, target, propertyKey);
};
