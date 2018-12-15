import CommandError from '../CommandError';
import {Interfaces} from '../Interfaces';
import TypeReaderValue from './TypeReaderValue';
import ResultInterface = Interfaces.ResultInterface;

export default class TypeReaderResult implements ResultInterface {
    public static FromSuccess(value: TypeReaderValue | TypeReaderValue[]): TypeReaderResult {
        return new TypeReaderResult(Array.isArray(value) ? value : [value]);
    }

    public static FromError(error: CommandError, reason: string): TypeReaderResult {
        return new TypeReaderResult(null, error, reason);
    }

    public IsSuccess: boolean;

    constructor(public Values: TypeReaderValue[], public Error?: CommandError, public ErrorReason?: string) {
        this.IsSuccess = !Error;
    }
};
