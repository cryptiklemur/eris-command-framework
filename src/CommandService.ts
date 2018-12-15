import {Container, inject, injectable} from 'inversify';
import {Dictionary} from 'typescript-collections';

import CommandContext from './CommandContext';
import CommandError from './CommandError';
import CommandParser from './CommandParser';
import CommandInfo from './Info/CommandInfo';
import {Interfaces} from './Interfaces';
import ParseResult from './Result/ParseResult';
import PreconditionResult from './Result/PreconditionResult';
import SearchResult from './Result/SearchResult';
import Authorizer from './Security/Authorizer';
import TYPES from './types';

@injectable()
export default class CommandService {
    private static GetMessageStart(input: string, command: CommandInfo) {
        let start = 0;
        for (let alias of command.Aliases) {
            if (input.startsWith(alias) && alias.length > start) {
                start = alias.length;
            }
        }

        return start + 1;
    }

    private authorizer: Authorizer;

    private commandParser: CommandParser;

    // tslint:disable-next-line
    private plugins: Dictionary<string, Interfaces.PluginInterface> = new Dictionary<string, Interfaces.PluginInterface>();

    private commands: CommandInfo[]                                 = [];

    constructor(@inject('Container') private container: Container) {
        this.authorizer    = container.get<Authorizer>(TYPES.Security.Authorizer);
        this.commandParser = container.get<CommandParser>(TYPES.Command.Parser);
    }

    public async Initialize(plugins: { [name: string]: Interfaces.PluginInterface }): Promise<void> {
        for (const name in plugins) {
            if (!plugins.hasOwnProperty(name)) {
                continue;
            }

            const plugin: Interfaces.PluginInterface = this.container.getNamed<Interfaces.PluginInterface>(
                TYPES.Plugin,
                name,
            );
            const prototype: any                     = Object.getPrototypeOf(plugin);
            this.plugins.setValue(name, plugin);

            const methods: string[] = Object.getOwnPropertyNames(prototype)
                                            .filter((key) => typeof prototype[key] === 'function');

            methods.forEach(
                (method) => {
                    const command: Interfaces.CommandInterface = Reflect.getMetadata('command', plugin, method);
                    if (command) {
                        command.Plugin = plugin;
                        command.Code   = plugin[method];

                        this.commands.push(new CommandInfo(command));
                    }
                },
            );

        }
    }

    /**
     * @param {CommandContext} context
     * @param {number} messageStart
     * @returns {Promise<Interfaces.ResultInterface>}
     */
    public async ExecuteAsync(context: CommandContext, messageStart: number = 0): Promise<Interfaces.ResultInterface> {
        const input: string = context.Message.content.substr(messageStart).trim();

        const searchResult: SearchResult = await this.SearchAsync(context, input);
        if (!searchResult.IsSuccess) {
            return searchResult;
        }

        for (let command of searchResult.Commands) {
            let preconditionResult: PreconditionResult = this.CheckPermissions(context, command);
            if (!preconditionResult.IsSuccess) {
                if (searchResult.Commands.length === 1) {
                    return preconditionResult;
                }
                continue;
            }

            let parseResult: ParseResult = await this.commandParser.ParseAsync(
                context,
                command,
                messageStart + CommandService.GetMessageStart(input, command),
            );
            // this._logger.info("Parse result: ", parseResult);
            if (!parseResult.IsSuccess) {
                if (parseResult.Error === CommandError.MultipleMatches) {
                    parseResult = ParseResult.FromMultipleSuccess(
                        parseResult.argValues.map((x) => x.Values.sort((a, b) => a.Score < b.Score ? 1 : -1)[0]),
                    );
                }

                if (!parseResult.IsSuccess) {
                    if (searchResult.Commands.length === 1) {
                        return parseResult;
                    }

                    continue;
                }
            }

            return await command.ExecuteCommandAsync(context, parseResult);
        }

        return searchResult;
    }

    public HasPlugin(name: string): boolean {
        return this.plugins.containsKey(name);
    }

    // @ts-ignore
    public async SearchAsync(context: CommandContext, input?: string): Promise<SearchResult> {
        let matches: CommandInfo[] = this.commands;
        if (input !== null && input !== undefined) {
            input   = input.toLocaleLowerCase();
            matches = matches.filter(
                (x) => {
                    for (let alias of x.Aliases) {
                        if (input.startsWith(alias)) {
                            return true;
                        }
                    }

                    return false;
                },
            );
        }

        return matches.length > 0
               ? SearchResult.FromSuccess(input, matches)
               : SearchResult.FromError(CommandError.UnknownCommand, 'Unknown command.');
    }

    private CheckPermissions(context: CommandContext, command: CommandInfo): PreconditionResult {
        const authorized: boolean = this.authorizer.IsAuthorized(
            command.PermissionNode,
            context.Member || context.User,
            command.PermissionStrict,
        );

        return authorized
               ? PreconditionResult.FromSuccess()
               : PreconditionResult.FromError(CommandError.UnmetPrecondition, 'Failed Permission Check');
    }
};
