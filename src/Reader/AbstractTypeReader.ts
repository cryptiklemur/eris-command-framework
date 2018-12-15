import {Client} from 'eris';

import CommandContext from '../CommandContext';
import {Interfaces} from '../Interfaces';
import TypeReaderResult from '../Result/TypeReaderResult';
import TypeReaderInterface = Interfaces.TypeReaderInterface;

export default abstract class AbstractTypeReader implements TypeReaderInterface {
    public abstract Read(client: Client, context: CommandContext, input: string): TypeReaderResult;

    public GetTypes(): any[] {
        return null;
    }
}
