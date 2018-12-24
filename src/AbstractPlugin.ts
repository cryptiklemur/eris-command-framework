import {Client, TextableChannel} from 'eris';
import {Container, inject, injectable} from 'inversify';
import * as moment from 'moment';
import {Connection, Repository} from 'typeorm';
import {Logger} from 'winston';

import MessageBuffer from './Buffer/MessageBuffer';
import CommandContext from './CommandContext';
import Configuration from './Configuration';
import {Interfaces} from './Interfaces';
import Embed from './Model/Embed';
import TYPES from './types';

@injectable()
export default abstract class AbstractPlugin implements Interfaces.PluginInterface {
    public static Name: string;
    public static Config: any = {};

    public static addToContainer(container: Container, types: any): void {
        throw new Error('plugin must implement addToContainer, even if its empty.');
    }

    public static getEntities(): any[] {
        throw new Error('plugin must implement getEntities, even if its empty.');
    }

    protected static rgbToHex(r: number, g: number, b: number): number {
        let num: string = '0x';
        num += [r, g, b].map(
            (x) => {
                const hex: string = x.toString(16);

                return hex.length === 1 ? '0' + hex : hex;
            },
        ).join('');

        return parseInt(num, 10);
    }

    protected get prefix() {
        return this.configuration.prefix;
    }

    @inject(TYPES.discordClient)
    public client: Client;

    @inject(TYPES.configuration)
    public configuration: Configuration;

    @inject(TYPES.messageBuffer)
    public messageBuffer: MessageBuffer;

    @inject(TYPES.connection)
    public database: Connection;

    @inject(TYPES.logger)
    public logger: Logger;

    public context: CommandContext;

    public async initialize(): Promise<void> {
    }

    protected getDefaultColor(): number {
        return AbstractPlugin.rgbToHex(66, 139, 202);
    }

    protected async reactOk(): Promise<void> {
        return this.context.Message.addReaction('👍🏻');
    }

    protected async reactNotOk(): Promise<void> {
        return this.context.Message.addReaction('👎🏻');
    }

    protected async reply(content: string): Promise<void> {
        await this.sendMessage(this.context.channel, content);
    }

    protected async sendMessage(channel: TextableChannel, content: string): Promise<void> {
        this.messageBuffer.addItem(channel, content);
    }

    protected async sendEmbed(embed: Embed): Promise<void> {
        try {
            let jsonEmbed: any = embed.serialize();
            this.logger.info('Creating embed: %j', jsonEmbed);

            await this.context.channel.createMessage({embed: jsonEmbed});
        } catch (error) {
            this.logger.error('error sending approvalMessage: %s', error.response);
            throw error;
        }
    }

    protected async embedMessage(action: ((x: Embed) => any)): Promise<void> {
        const embed: Embed = new Embed(
            {
                author:    {
                    iconUrl: this.client.user.avatarURL,
                    name:    this.client.user.username,
                },
                color:     this.getDefaultColor(),
                fields:    [],
                timestamp: moment().utc().toDate(),
            },
        );

        action(embed);

        return await this.sendEmbed(embed);
    }

    protected getRepository<T>(entityClass: any): Repository<T> {
        return this.database.getRepository<T>(entityClass) as Repository<T>;
    }
}
