import {Client, Message} from 'eris';
import {inject, injectable} from 'inversify';
import {Logger as LoggerInstance} from 'winston';

import CommandContext from './CommandContext';
import CommandService from './CommandService';
import Configuration from './Configuration';
import {Interfaces} from './Interfaces';
import ExecuteResult from './Result/ExecuteResult';
import TYPES from './types';
import ResultInterface = Interfaces.ResultInterface;

@injectable()
export default class CommandHandler {
    @inject(TYPES.Configuration)
    private configuration: Configuration;

    @inject(TYPES.DiscordClient)
    private client: Client;

    @inject(TYPES.Command.Service)
    private commands: CommandService;

    @inject(TYPES.Logger)
    private logger: LoggerInstance;

    public Install(): void {
        this.client.on('messageCreate', this.HandleCommand.bind(this));
        if (this.configuration.onMessageUpdate) {
            this.client.on('messageUpdate', this.HandleCommand.bind(this));
        }
    }

    private async HandleCommand(message: Message): Promise<void> {
        if (!message || !message.author || message.author.id === this.client.user.id) {
            return;
        }

        const context: CommandContext = new CommandContext(this.client, message);
        let messageStart: number      = 0;

        if (message.content.startsWith(this.configuration.prefix)) {
            messageStart = 1;
        } else if (message.content.startsWith(this.client.user.mention)) {
            messageStart = this.client.user.mention.length;
        }

        if (messageStart > 0 || !context.Guild) {
            try {
                const result: ResultInterface = await this.commands.ExecuteAsync(context, messageStart);
                if (result.IsSuccess === false) {
                    this.logger.error('%s %s',result.Error.toString(), result.ErrorReason);
                    if (result instanceof ExecuteResult) {
                        this.logger.error('Exception: %s', result.Exception.stack);
                    }
                }

            } catch (error) {
                this.logger.error('Error running command: %s', error.stack);
            }
        }
    }
};
