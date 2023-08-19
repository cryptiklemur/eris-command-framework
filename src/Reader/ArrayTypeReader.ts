import {Client} from 'eris';

import CommandContext from '../CommandContext';
import TypeReaderResult from '../Result/TypeReaderResult';
import TypeReaderValue from '../Result/TypeReaderValue';
import AbstractTypeReader from './AbstractTypeReader';

export default class ArrayTypeReader extends AbstractTypeReader {
    public read(client: Client, context: CommandContext, input: string): TypeReaderResult {
        return TypeReaderResult.fromSuccess([new TypeReaderValue(input.split(' '), 0.90)]);
    }

    public getTypes(): any[] {
        return [Array];
    }
};
