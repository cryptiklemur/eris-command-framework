import {Client, Message} from 'eris';
import {inject, injectable} from 'inversify';
import {Logger as LoggerInstance} from 'winston';

import CommandContext from './CommandContext';
import CommandService from './CommandService';
import {Interfaces} from './Interfaces';
import ExecuteResult from './Result/ExecuteResult';
import TYPES from './types';
import ResultInterface = Interfaces.ResultInterface;

@injectable()
export default class CommandHandler {
    @inject(TYPES.DiscordClient)
    private _client: Client;

    @inject(TYPES.Command.Service)
    private _commands: CommandService;

    @inject(TYPES.Logger)
    private _logger: LoggerInstance;

    public Install(): void {
        this._client.on('messageCreate', this.HandleCommand.bind(this));
        this._client.on('messageUpdate', this.HandleCommand.bind(this));
    }

    private async HandleCommand(message: Message): Promise<void> {
        if (!message || !message.author || message.author.id === this._client.user.id) {
            return;
        }

        const context: CommandContext = new CommandContext(this._client, message);
        let messageStart: number      = 0;
        let prefix: string            = '|';

        if (message.content.startsWith(prefix)) {
            messageStart = 1;
        } else if (message.content.startsWith(this._client.user.mention)) {
            messageStart = this._client.user.mention.length;
        }

        if (messageStart > 0 || !context.Guild) {
            try {
                const result: ResultInterface = await this._commands.ExecuteAsync(context, messageStart);
                if (result.IsSuccess === false) {
                    this._logger.error(result.Error.toString(), result.ErrorReason);
                    if (result instanceof ExecuteResult) {
                        this._logger.error('Exception: ', result.Exception);
                    }
                }

            } catch (error) {
                this._logger.error('Error running command: ', error);
            }
        }
    }
};
