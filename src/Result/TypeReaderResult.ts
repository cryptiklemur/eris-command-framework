import CommandError from '../CommandError';
import {Interfaces} from '../Interfaces';
import TypeReaderValue from './TypeReaderValue';

export default class TypeReaderResult implements Interfaces.ResultInterface {
    public static fromSuccess(value: TypeReaderValue | TypeReaderValue[]): TypeReaderResult {
        return new TypeReaderResult(Array.isArray(value) ? value : [value]);
    }

    public static fromError(error: CommandError, reason: string): TypeReaderResult {
        return new TypeReaderResult(null, error, reason);
    }

    public isSuccess: boolean;
    public reader: Interfaces.TypeReaderInterface;

    constructor(public values: TypeReaderValue[], public error?: CommandError, public errorReason?: string) {
        this.isSuccess = !error;
    }
};
