import {Client, Message} from 'eris';
import {EventEmitter} from 'events';
import {inject, injectable} from 'inversify';

import Configuration from './Configuration';
import Types from './types';

@injectable()
export default class InteractiveHelper {
    public constructor(
        @inject(Types.discordClient) private client: Client,
        @inject(Types.configuration) private configuration: Configuration,
    ) {
    }

    public listenForReplies(
        message: Message,
        timeout: number = 30 * 60 * 1000,
    ): EventEmitter {
        const emitter = new EventEmitter();
        const listener = (type) => (msg, ...arg) => {
            if (this.isReply(message, msg)) {
                emitter.emit(type, msg, ...arg);
            }
        };

        const listeners = {};
        for (const event of ['messageCreate', 'messageReactionAdd']) {
            const eventListener = listener(event);
            listeners[event]    = eventListener;
            this.client.on(event, eventListener);

            setTimeout(
                () => this.client.removeListener(event, eventListener),
                timeout,
            );
        }

        emitter.once('close', () => {
            for (const event of Object.keys(listeners)) {
                this.client.removeListener(event, listeners[event]);
            }
        });

        return emitter;
    }

    private isReply(original: Message, reply: Message): boolean {
        if (reply.content.indexOf(this.configuration.prefix) === 0) {
            return false;
        }

        if (original.author.id !== reply.author.id) {
            return false;
        }

        if (original.channel) {
            if (!reply.channel || original.channel.id !== reply.channel.id) {
                return false;
            }
        }

        return !(!original.channel && reply.channel);
    }
}
