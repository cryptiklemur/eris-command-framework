import {Client, Message} from 'eris';
import {inject, injectable} from 'inversify';
import Types from './types';

@injectable()
export default class InteractiveHelper {
    public constructor(@inject(Types.discordClient) private client: Client) {
    }

    public listenForReply(
        message: Message,
        type: 'messageCreate' | 'messageReactionAdd',
        callback: (message: Message) => Promise<void>,
        timeout: number = 5 * 60 * 1000,
    ): () => void {
        const listener = (msg) => InteractiveHelper.isReply(msg, message) ? callback(msg) : null;

        this.client.once(type, listener);
        setTimeout(
            () => this.client.removeListener(type, listener),
            timeout,
        );

        return () => this.client.removeListener(type, listener);
    }

    public listenForReplies(
        message: Message,
        type: 'messageCreate' | 'messageReactionAdd',
        callback: (message: Message) => Promise<void>,
        timeout: number = 5 * 60 * 1000,
    ): () => void {
        const listener = (msg) => InteractiveHelper.isReply(msg, message) ? callback(msg) : null;

        this.client.on(type, listener);
        setTimeout(
            () => this.client.removeListener(type, listener),
            timeout,
        );

        return () => this.client.removeListener(type, listener);
    }

    private static isReply(messageOne: Message, messageTwo: Message): boolean {
        if (messageOne.author.id !== messageTwo.author.id) {
            return false;
        }

        if (messageOne.channel) {
            if (!messageTwo.channel || messageOne.channel.id !== messageTwo.channel.id) {
                return false;
            }
        }

        if (!messageOne.channel && messageTwo.channel) {
            return false;
        }

        return true;
    }
}
