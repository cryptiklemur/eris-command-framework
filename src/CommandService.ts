import {Container, inject, injectable} from 'inversify';
import {Dictionary} from 'typescript-collections';
import AbstractPlugin from './AbstractPlugin';

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
    private static getMessageStart(input: string, command: CommandInfo) {
        let start = 0;
        for (let alias of command.aliases) {
            if (input.startsWith(alias) && alias.length > start) {
                start = alias.length;
            }
        }

        return start + 1;
    }

    private authorizer: Authorizer;

    private commandParser: CommandParser;

    // tslint:disable-next-line
    private plugins: Dictionary<string, AbstractPlugin> = new Dictionary<string, AbstractPlugin>();

    private commands: CommandInfo[] = [];

    constructor(@inject('Container') private container: Container) {
        this.authorizer    = container.get<Authorizer>(TYPES.security.authorizer);
        this.commandParser = container.get<CommandParser>(TYPES.command.parser);
    }

    public async initialize(plugins: { [name: string]: typeof AbstractPlugin }): Promise<void> {
        for (const name in plugins) {
            if (!plugins.hasOwnProperty(name)) {
                continue;
            }

            const plugin: AbstractPlugin = this.container.getNamed<AbstractPlugin>(TYPES.plugin, name);
            await plugin.initialize();
            const prototype: any = Object.getPrototypeOf(plugin);
            this.plugins.setValue(name, plugin);

            const methods: string[] = Object.getOwnPropertyNames(prototype)
                                            .filter((key) => typeof prototype[key] === 'function');

            methods.forEach(
                (method) => {
                    const command: Interfaces.CommandInterface = Reflect.getMetadata('command', plugin, method);
                    if (command) {
                        command.plugin = plugin;
                        command.code   = plugin[method];

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
    public async executeAsync(context: CommandContext, messageStart: number = 0): Promise<Interfaces.ResultInterface> {
        const input: string = context.message.content.substr(messageStart).trim();

        const searchResult: SearchResult = await this.searchAsync(context, input);
        if (!searchResult.isSuccess) {
            return searchResult;
        }

        for (let command of searchResult.commands) {
            let preconditionResult: PreconditionResult = this.checkPermissions(context, command);
            if (!preconditionResult.isSuccess) {
                if (searchResult.commands.length === 1) {
                    return preconditionResult;
                }
                continue;
            }

            let parseResult: ParseResult = await this.commandParser.parseAsync(
                context,
                command,
                messageStart + CommandService.getMessageStart(input, command),
            );
            // this._logger.info("Parse result: ", parseResult);
            if (!parseResult.isSuccess) {
                if (parseResult.error === CommandError.MultipleMatches) {
                    parseResult = ParseResult.FromMultipleSuccess(
                        parseResult.argValues.map((x) => x.values.sort((a, b) => a.Score < b.Score ? 1 : -1)[0]),
                    );
                }

                if (!parseResult.isSuccess) {
                    if (searchResult.commands.length === 1) {
                        return parseResult;
                    }

                    continue;
                }
            }

            return await command.executeCommandAsync(context, parseResult);
        }

        return searchResult;
    }

    public hasPlugin(name: string): boolean {
        return this.plugins.containsKey(name);
    }

    // @ts-ignore
    public async searchAsync(context: CommandContext, input?: string): Promise<SearchResult> {
        let matches: CommandInfo[] = this.commands;
        if (input !== null && input !== undefined) {
            input   = input.toLocaleLowerCase();
            matches = matches.filter(
                (x) => {
                    for (let alias of x.aliases) {
                        if (input.startsWith(alias)) {
                            return true;
                        }
                    }

                    return false;
                },
            );
        }

        return matches.length > 0
               ? SearchResult.fromSuccess(input, matches)
               : SearchResult.fromError(CommandError.UnknownCommand, 'Unknown command.');
    }

    private checkPermissions(context: CommandContext, command: CommandInfo): PreconditionResult {
        const authorized: boolean = this.authorizer.isAuthorized(
            command.permissionNode,
            context.member || context.user,
            command.permissionStrict,
        );

        return authorized
               ? PreconditionResult.fromSuccess()
               : PreconditionResult.fromError(CommandError.UnmetPrecondition, 'Failed Permission Check');
    }
};
