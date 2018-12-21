import {Client} from 'eris';

import CommandContext from '../CommandContext';
import {Interfaces} from '../Interfaces';
import TypeReaderResult from '../Result/TypeReaderResult';

export default abstract class AbstractTypeReader implements Interfaces.TypeReaderInterface {
    public abstract read(client: Client, context: CommandContext, input: string): TypeReaderResult;

    public getTypes(): any[] {
        return null;
    }
}
