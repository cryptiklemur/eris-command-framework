import {Client} from 'eris';

import CommandContext from '../CommandContext';
import TypeReaderResult from '../Result/TypeReaderResult';
import TypeReaderValue from '../Result/TypeReaderValue';
import AbstractTypeReader from './AbstractTypeReader';

export default class PrimitiveTypeReader extends AbstractTypeReader {
    // @ts-ignore
    public Read(client: Client, context: CommandContext, input: string): TypeReaderResult {
        let num: number = parseInt(input, 10);
        if (!isNaN(num) && Number.isSafeInteger(num)) {
            return TypeReaderResult.FromSuccess([new TypeReaderValue(num, 1.0)]);
        }

        return TypeReaderResult.FromSuccess([new TypeReaderValue(input, 1.0)]);

    }
};
