import {Interfaces} from '../Interfaces';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default () => (target: any, propertyKey: string, parameterIndex: number): void => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument
    const metadata: Interfaces.CommandInterface = Reflect.getOwnMetadata('command', target, propertyKey) || {};

    metadata.remainderField = parameterIndex;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Reflect.defineMetadata('command', metadata, target, propertyKey);
};
