import {Client} from 'eris';

import CommandContext from '../CommandContext';
import CommandError from '../CommandError';
import TypeReaderResult from '../Result/TypeReaderResult';
import TypeReaderValue from '../Result/TypeReaderValue';
import AbstractTypeReader from './AbstractTypeReader';

export default class EnumTypeReader extends AbstractTypeReader {
    private _type: any;

    public setEnum(type: any): void {
        this._type = type;
    }

    public getTypes(): any[] {
        return [this._type];
    }

    // @ts-ignore
    public read(client: Client, context: CommandContext, input: string): TypeReaderResult {
        const mayBeContext: any | undefined = this._type[input];
        if (mayBeContext !== undefined) {
            return TypeReaderResult.fromSuccess([new TypeReaderValue(mayBeContext, 1.00)]);
        }

        for (let key in this._type) {
            if (!this._type.hasOwnProperty(key) || isNaN(+key)) {
                continue;
            }

            let value: string = this._type[key];
            if (value.toLocaleLowerCase() === input.toLocaleLowerCase()) {
                if (isNaN(<any> key)) {
                    return TypeReaderResult.fromSuccess([new TypeReaderValue(key, 0.90)]);
                } else {
                    return TypeReaderResult.fromSuccess([new TypeReaderValue(parseInt(key, 10), 0.90)]);
                }
            }
        }

        return TypeReaderResult.fromError(CommandError.ObjectNotFound, 'Failed to parse enum.');
    }
};
