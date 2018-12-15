import CommandError from '../CommandError';
import {Interfaces} from '../Interfaces';
import ResultInterface = Interfaces.ResultInterface;

export default class ExecuteResult implements ResultInterface {
    public static FromSuccess(): ExecuteResult {
        return new ExecuteResult();
    }

    public static FromError(error: CommandError, reason: string): ExecuteResult {
        return new ExecuteResult(null, error, reason);
    }

    public static FromException(error: Error): ExecuteResult {
        return new ExecuteResult(error, CommandError.Exception, error.message);
    }

    public static FromResult(result: ResultInterface): ExecuteResult {
        return new ExecuteResult(null, result.Error, result.ErrorReason);
    }

    public IsSuccess: boolean;

    constructor(public Exception?: Error, public Error?: CommandError, public ErrorReason?: string) {
        this.IsSuccess = !Error;
    }
};
