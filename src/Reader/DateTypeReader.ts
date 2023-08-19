import * as chrono from 'chrono-node';
import {Client} from 'eris';

import CommandContext from '../CommandContext';
import CommandError from '../CommandError';
import TypeReaderResult from '../Result/TypeReaderResult';
import TypeReaderValue from '../Result/TypeReaderValue';
import AbstractTypeReader from './AbstractTypeReader';

export default class DateTypeReader extends AbstractTypeReader {
    public getTypes(): any[] {
        return [Date];
    }

    // @ts-ignore
    public read(client: Client, context: CommandContext, input: string): TypeReaderResult {
        try {
            return TypeReaderResult.fromSuccess(new TypeReaderValue(chrono.parseDate(input, new Date()), 1.0));
        } catch (error) {}

        return TypeReaderResult.fromError(CommandError.ParseFailed, 'Unable to parse duration.');
    }
};
