import {Client} from 'eris';

import CommandContext from '../CommandContext';
import TypeReaderResult from '../Result/TypeReaderResult';
import TypeReaderValue from '../Result/TypeReaderValue';
import AbstractTypeReader from './AbstractTypeReader';

export default class PrimitiveTypeReader extends AbstractTypeReader {
    // @ts-ignore
    public Read(client: Client, context: CommandContext, input: string): TypeReaderResult {
        if (/^[0-9.,]+$/.test(input)) {
            const num: number = parseInt(input.replace(/,/g, ''), 10);

            return TypeReaderResult.FromSuccess([new TypeReaderValue(num, 1.0)]);
        }

        return TypeReaderResult.FromSuccess([new TypeReaderValue(input, 1.0)]);

    }
};
