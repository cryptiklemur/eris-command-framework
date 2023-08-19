import StringBuilder from '../Builder/StringBuilder';
import CommandContext from '../CommandContext';
import CommandError from '../CommandError';
import {PermissionOptions} from '../Decorator/Permission';
import {Interfaces} from '../Interfaces';
import ExecuteResult from '../Result/ExecuteResult';
import ParseResult from '../Result/ParseResult';
import ParameterInfo from './ParameterInfo';
import CommandInterface = Interfaces.CommandInterface;
import PluginInterface = Interfaces.PluginInterface;

const re: RegExp = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=*('(?:\\'|[^'\r\n])*'))/mg;

export default class CommandInfo implements CommandInterface {
    public plugin: PluginInterface;

    public aliases: string[] = [];

    public shortDescription?: string;

    public longDescription?: string;

    public syntax?: string = '';

    public permissionNode?: string = null;

    public permissionStrict: boolean = false;

    public permissionOptions?: PermissionOptions = {};

    public parameters: ParameterInfo[] = [];

    // eslint-disable-next-line @typescript-eslint/ban-types
    public code: Function;

    public types: object = {};

    public remainderField: number = undefined;

    public requiredFields: number[] = [];

    constructor(init?: Partial<CommandInterface>) {
        Object.assign(this, init);

        this.initialize();
    }

    public get name(): string {
        return this.aliases[0];
    }

    public async executeCommandAsync(context: CommandContext, parseResult: ParseResult): Promise<ExecuteResult> {
        this.plugin.context    = context;
        const argList: any[]   = [];
        const paramList: any[] = [];
        for (let i = 0; i < parseResult.argValues.length; i++) {
            if (!parseResult.argValues[i].isSuccess) {
                return ExecuteResult.fromResult(parseResult.argValues[i]);
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            argList[i] = parseResult.argValues[i].values[0].Value;
        }
        for (let i = 0; i < parseResult.paramValues.length; i++) {
            if (!parseResult.paramValues[i].isSuccess) {
                return ExecuteResult.fromResult(parseResult.paramValues[i]);
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            paramList[i] = parseResult.paramValues[i].values[0].Value;
        }

        const hasVarArgs: boolean = this.parameters.length > 0
            ? this.parameters[this.parameters.length - 1].isMultiple : false;
        const argCount: number    = this.parameters.length - (hasVarArgs ? 1 : 0);
        const args: any[]         = [];

        let i: number = 0;
        for (const arg of argList) {
            if (i === argCount) {
                return ExecuteResult.fromError(
                    CommandError.BadArgCount,
                    'command was invoked with too many parameters',
                );
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            args[i++] = arg;
        }

        if (i < argCount) {
            return ExecuteResult.fromError(
                CommandError.BadArgCount,
                'command was invoked with too few parameters',
            );
        }

        if (hasVarArgs) {
            paramList.forEach((param) => args.push(param));
        }

        try {
            await this.code.apply(this.plugin, args);

            return ExecuteResult.fromSuccess();
        } catch (error) {
            return ExecuteResult.fromException(error as Error);
        }
    }

    private initialize(): void {
        this.buildParameters();
        this.buildSyntax();
    }

    private buildParameters(): void {
        const names: string[] = this.getParameters();
        for (let index: number = 0; index < names.length; index++) {
            if (!names.hasOwnProperty(index)) {
                continue;
            }

            const name: string      = names[index];
            const cleanName: string = name.replace(/(^\.\.\.)|(\s+=\s+"?.+"?)$/g, '');
            let defaultValue: any;

            const defaultMatch: RegExpMatchArray = name.match(/\s+=\s+("?.+"?)$/);
            if (defaultMatch && defaultMatch[1] !== undefined) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                defaultValue = JSON.parse(defaultMatch[1]);
            }

            const param: ParameterInfo = new ParameterInfo(
                cleanName,
                this.types[cleanName],
                this.remainderField !== undefined && this.remainderField === index,
                name.indexOf('...') === 0,
                defaultValue,
            );
            this.parameters.push(param);
        }
    }

    private getParameters(): string[] {
        const paramsRegex: RegExp      = /^(?:async )?[A-Za-z]+\(([A-Za-z0-9-_+."'\/*,\s=]+)?\)\s+{/m;
        const code: string             = this.code.toString().replace(re, '');
        const result: RegExpMatchArray = code.match(paramsRegex);
        if (!result || !result[1]) {
            return [];
        }

        let params: string         = result[1];
        const paramArray: string[] = [];
        const commaRegex: RegExp   = /(?!\B"[^"]*),(?![^"]*"\B)/;

        do {
            const match: RegExpMatchArray = params.match(commaRegex);
            if (!match) {
                paramArray.push(params);
                break;
            }

            const param: string = params.substring(0, match.index).trim();
            params              = params.substring(match.index + 1, params.length).trim();
            paramArray.push(param);
        } while (true);

        return paramArray;
    }

    private buildSyntax(): void {
        const message: StringBuilder = new StringBuilder();
        message.append(`{prefix}${this.name} `);
        for (const parameter of this.parameters) {
            message.append('<');
            if (parameter.isMultiple || parameter.remainder) {
                message.append('...');
            }
            message.append(parameter.name);
            if (parameter.isOptional) {
                message.append('?');
            }
            if (parameter.defaultValue !== undefined && parameter.defaultValue !== null) {
                message.append('=' + JSON.stringify(parameter.defaultValue));
            }

            message.append('> ');
        }

        this.syntax = message.toString().trim();
    }
};
