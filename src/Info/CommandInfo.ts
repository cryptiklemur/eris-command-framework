import StringBuilder from '../Builder/StringBuilder';
import CommandContext from '../CommandContext';
import CommandError from '../CommandError';
import {Interfaces} from '../Interfaces';
import ExecuteResult from '../Result/ExecuteResult';
import ParseResult from '../Result/ParseResult';
import ParameterInfo from './ParameterInfo';
import CommandInterface = Interfaces.CommandInterface;
import PluginInterface = Interfaces.PluginInterface;

const re: RegExp = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=*('(?:\\'|[^'\r\n])*'))/mg;

export default class CommandInfo implements CommandInterface {
    public Plugin: PluginInterface;
    public Aliases: string[]           = [];
    public ShortDescription?: string;
    public LongDescription?: string;
    public Syntax?: string             = '';
    public PermissionNode?: string     = null;
    public PermissionStrict: boolean   = false;
    public Parameters: ParameterInfo[] = [];
    public Code: Function;
    public Types: Object               = {};
    public RemainderFields: number[]   = [];
    public RequiredFields: number[]    = [];

    constructor(init?: Partial<CommandInterface>) {
        Object.assign(this, init);

        this.Initialize();
    }

    public get Name(): string {
        return this.Aliases[0];
    }

    public async ExecuteCommandAsync(context: CommandContext, parseResult: ParseResult): Promise<ExecuteResult> {
        this.Plugin.Context    = context;
        const argList: any[]   = [];
        const paramList: any[] = [];
        for (let i = 0; i < parseResult.argValues.length; i++) {
            if (!parseResult.argValues[i].IsSuccess) {
                return ExecuteResult.FromResult(parseResult.argValues[i]);
            }
            argList[i] = parseResult.argValues[i].Values[0].Value;
        }
        for (let i = 0; i < parseResult.paramValues.length; i++) {
            if (!parseResult.paramValues[i].IsSuccess) {
                return ExecuteResult.FromResult(parseResult.paramValues[i]);
            }
            paramList[i] = parseResult.paramValues[i].Values[0].Value;
        }

        const hasVarArgs: boolean = this.Parameters.length > 0
                                    ? this.Parameters[this.Parameters.length - 1].IsMultiple : false;
        const argCount: number    = this.Parameters.length - (hasVarArgs ? 1 : 0);
        const args: any[]         = [];

        let i: number = 0;
        for (let arg of argList) {
            if (i === argCount) {
                return ExecuteResult.FromError(
                    CommandError.BadArgCount,
                    'Command was invoked with too many parameters',
                );
            }
            args[i++] = arg;
        }

        if (i < argCount) {
            return ExecuteResult.FromError(
                CommandError.BadArgCount,
                'Command was invoked with too few parameters',
            );
        }

        if (hasVarArgs) {
            paramList.forEach((param) => args.push(param));
        }

        try {
            await this.Code.apply(this.Plugin, args);
            return ExecuteResult.FromSuccess();
        } catch (error) {
            return ExecuteResult.FromException(error);
        }
    }

    private Initialize(): void {
        this.BuildParameters();
        this.BuildSyntax();
    }

    private BuildParameters(): void {
        const names: string[] = this.GetParameters();
        for (let index: number = 0; index < names.length; index++) {
            if (!names.hasOwnProperty(index)) {
                continue;
            }

            const name: string      = names[index];
            const cleanName: string = name.replace(/(^\.\.\.)|(\s+=\s+"?.+"?)$/g, '');
            let defaultValue: any   = undefined;

            let defaultMatch: RegExpMatchArray = name.match(/\s+=\s+("?.+"?)$/);
            if (defaultMatch && defaultMatch[1] !== undefined) {
                defaultValue = JSON.parse(defaultMatch[1]);
            }

            const param: ParameterInfo = new ParameterInfo(
                cleanName,
                this.Types[cleanName],
                this.RemainderFields && this.RemainderFields.indexOf(index) >= 0,
                name.indexOf('...') === 0,
                defaultValue,
            );
            this.Parameters.push(param);
        }
    }

    private GetParameters(): string[] {
        const paramsRegex: RegExp      = /^[A-Za-z]+\(([A-Za-z0-9-_+."'/*,\s=]+)?\)\s+{/m;
        const code: string             = this.Code.toString().replace(re, '');
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

    private BuildSyntax(): void {
        const message: StringBuilder = new StringBuilder();
        message.Append(`{prefix}${this.Name} `);
        for (let parameter of this.Parameters) {
            message.Append('<');
            if (parameter.IsMultiple || parameter.Remainder) {
                message.Append('...');
            }
            message.Append(parameter.Name);
            if (parameter.IsOptional) {
                message.Append('?');
            }
            if (parameter.DefaultValue !== undefined && parameter.DefaultValue !== null) {
                message.Append('=' + JSON.stringify(parameter.DefaultValue));
            }

            message.Append('> ');
        }

        this.Syntax = message.toString().trim();
    }
};
