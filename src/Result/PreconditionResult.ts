import CommandError from '../CommandError';
import {Interfaces} from '../Interfaces';

export default class PreconditionResult implements Interfaces.ResultInterface {
    public static fromSuccess(): PreconditionResult {
        return new PreconditionResult();
    }

    public static fromError(error: CommandError, reason: string): PreconditionResult {
        return new PreconditionResult(error, reason);
    }

    public isSuccess: boolean;

    constructor(public error?: CommandError, public errorReason?: string) {
        this.isSuccess = !error;
    }
};
