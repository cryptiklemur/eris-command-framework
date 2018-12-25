import CommandError from '../CommandError';
import CommandInfo from '../Info/CommandInfo';
import {Interfaces} from '../Interfaces';

export default class SearchResult implements Interfaces.ResultInterface {
    public static fromSuccess(input: string, matches: CommandInfo[]): SearchResult {
        return new SearchResult(input, matches);
    }

    public static fromError(error: CommandError, reason: string): SearchResult {
        return new SearchResult(null, null, error, reason);
    }

    public isSuccess: boolean;

    constructor(
        public text?: string,
        public commands?: CommandInfo[],
        public error?: CommandError,
        public errorReason?: string,
    ) {
        this.isSuccess = !error;
    }
};
