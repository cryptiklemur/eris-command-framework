import CommandError from '../CommandError';
import CommandInfo from '../Info/CommandInfo';
import {Interfaces} from '../Interfaces';
import TypeReaderResult from './TypeReaderResult';
import TypeReaderValue from './TypeReaderValue';
import ResultInterface = Interfaces.ResultInterface;

export default class ParseResult implements ResultInterface {
    public static FromSuccess(argValues: TypeReaderResult[], paramValues: TypeReaderResult[]): ParseResult {
        for (let i = 0; i < argValues.length; i++) {
            if (!argValues.hasOwnProperty(i)) {
                continue;
            }

            if (argValues[i].values.length > 1) {
                return new ParseResult(argValues, paramValues, CommandError.MultipleMatches, 'Multiple matches found.');
            }
        }
        for (let i = 0; i < paramValues.length; i++) {
            if (!argValues.hasOwnProperty(i)) {
                continue;
            }

            if (paramValues[i].values.length > 1) {
                return new ParseResult(argValues, paramValues, CommandError.MultipleMatches, 'Multiple matches found.');
            }
        }

        return new ParseResult(argValues, paramValues);
    }

    public static FromMultipleSuccess(
        argValues: TypeReaderValue[], paramValues?: TypeReaderValue[],
    ): ParseResult {
        const argList: TypeReaderResult[] = [];
        for (let i = 0; i < argValues.length; i++) {
            argList[i] = TypeReaderResult.fromSuccess(argValues[i]);
        }
        let paramList: TypeReaderResult[] = [];
        if (paramValues) {
            for (let i = 0; i < paramValues.length; i++) {
                paramList[i] = TypeReaderResult.fromSuccess(paramValues[i]);
            }
        }

        return new ParseResult(argList, paramList);
    }

    public static FromError(error: CommandError, reason: string): ParseResult {
        return new ParseResult(null, null, error, reason);
    }

    public isSuccess: boolean;

    public Command: CommandInfo;

    constructor(
        public argValues: TypeReaderResult[],
        public paramValues: TypeReaderResult[],
        public Error?: CommandError,
        public ErrorReason?: string,
    ) {
        this.isSuccess = !Error;
    }
};
