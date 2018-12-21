import CommandError from '../CommandError';
import {Interfaces} from '../Interfaces';

export default class ExecuteResult implements Interfaces.ResultInterface {
    public static fromSuccess(): ExecuteResult {
        return new ExecuteResult();
    }

    public static fromError(error: CommandError, reason: string): ExecuteResult {
        return new ExecuteResult(null, error, reason);
    }

    public static fromException(error: Error): ExecuteResult {
        return new ExecuteResult(error, CommandError.Exception, error.message);
    }

    public static fromResult(result: Interfaces.ResultInterface): ExecuteResult {
        return new ExecuteResult(null, result.error, result.errorReason);
    }

    public isSuccess: boolean;

    constructor(public exception?: Error, public error?: CommandError, public errorReason?: string) {
        this.isSuccess = !error;
    }
};
