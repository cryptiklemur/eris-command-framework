import {Client} from 'eris';

import CommandContext from './CommandContext';
import CommandError from './CommandError';
import {PermissionOptions} from './Decorator/Permission';
import ParameterInfo from './Info/ParameterInfo';
import TypeReaderResult from './Result/TypeReaderResult';

export namespace Interfaces {
    export interface PluginInterface {
        context: CommandContext;

        initialize();
    }

    export interface CommandInterface {
        plugin: PluginInterface;
        aliases: string[];
        shortDescription?: string;
        longDescription?: string;
        syntax?: string;
        permissionNode?: string;
        permissionStrict: boolean;
        permissionOptions?: PermissionOptions;
        parameters: ParameterInfo[];
        code: Function;
        types: Object;
        remainderField: number;
        requiredFields: number[];
    }

    export interface TypeReaderInterface {
        read(client: Client, context: CommandContext, input: string): TypeReaderResult;

        getTypes(): any[];
    }

    export interface ResultInterface {
        error?: CommandError;
        errorReason?: string;
        isSuccess: boolean;
    }
}
