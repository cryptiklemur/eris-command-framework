import CommandError from '../CommandError';
import {Interfaces} from '../Interfaces';
import ResultInterface = Interfaces.ResultInterface;

export default class PreconditionResult implements ResultInterface {
    public static FromSuccess(): PreconditionResult {
        return new PreconditionResult();
    }

    public static FromError(error: CommandError, reason: string): PreconditionResult {
        return new PreconditionResult(error, reason);
    }

    public IsSuccess: boolean;

    constructor(public Error?: CommandError, public ErrorReason?: string) {
        this.IsSuccess = !Error;
    }
};
