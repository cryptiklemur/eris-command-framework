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
    @inject(TYPES.configuration)
    private configuration: Configuration;

    @inject(TYPES.discordClient)
    private client: Client;

    @inject(TYPES.command.service)
    private commands: CommandService;

    @inject(TYPES.logger)
    private logger: LoggerInstance;

    public install(): void {
        this.client.on('messageCreate', this.handleCommand.bind(this));
        if (this.configuration.onMessageUpdate) {
            this.client.on('messageUpdate', this.handleCommand.bind(this));
        }
    }

    private async handleCommand(message: Message): Promise<void> {
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

        if (messageStart > 0 || !context.guild) {
            try {
                const result: ResultInterface = await this.commands.executeAsync(context, messageStart);
                if (result.isSuccess === false) {
                    this.logger.error('code: %d reason: %s', result.error.toString(), result.errorReason);
                    if (result instanceof ExecuteResult) {
                        this.logger.error('exception: %O', (result as ExecuteResult).exception);
                    }
                }
                this.client.emit('commandExecuted', message, context, result);

            } catch (error) {
                this.logger.error('error running command: %O', error);
            }
        }
    }
};
