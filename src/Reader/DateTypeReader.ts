import * as chrono from 'chrono-node';
import {Client} from 'eris';

import CommandContext from '../CommandContext';
import CommandError from '../CommandError';
import TypeReaderResult from '../Result/TypeReaderResult';
import TypeReaderValue from '../Result/TypeReaderValue';
import AbstractTypeReader from './AbstractTypeReader';

export default class DateTypeReader extends AbstractTypeReader {
    public GetTypes(): any[] {
        return [Date];
    }

    // @ts-ignore
    public Read(client: Client, context: CommandContext, input: string): TypeReaderResult {
        try {
            console.log(input, chrono.parseDate(input, Date.now()));

            return TypeReaderResult.FromSuccess(new TypeReaderValue(chrono.parseDate(input, Date.now()), 1.0));
        } catch (error) {}

        return TypeReaderResult.FromError(CommandError.ParseFailed, 'Unable to parse duration.');
    }
};
