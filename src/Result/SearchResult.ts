import CommandError from '../CommandError';
import CommandInfo from '../Info/CommandInfo';
import {Interfaces} from '../Interfaces';
import ResultInterface = Interfaces.ResultInterface;

export default class SearchResult implements ResultInterface {
    public static FromSuccess(input: string, matches: CommandInfo[]): SearchResult {
        return new SearchResult(input, matches);
    }

    public static FromError(error: CommandError, reason: string): SearchResult {
        return new SearchResult(null, null, error, reason);
    }

    public IsSuccess: boolean;

    constructor(
        public Text?: string, public Commands?: CommandInfo[],
        public Error?: CommandError,
        public ErrorReason?: string,
    ) {
        this.IsSuccess = !Error;
    }
};
