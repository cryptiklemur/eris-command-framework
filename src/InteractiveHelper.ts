import {Client, Message} from 'eris';
import {EventEmitter} from 'events';
import {inject, injectable} from 'inversify';

import Configuration from './Configuration';
import Types from './types';

export const ALLOWED_EVENTS = [
    'messageCreate',
    'messageReactionAdd',
    'messageReactionRemove',
    'messageReactionRemoveAll',
    'messageUpdate',
    'messageDelete'
];

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
        const listener = (type) => (msg, ...args) => {
            if (this.isReply(type, message, msg, args)) {
                emitter.emit(type, msg, ...args);
            }
        };

        const listeners = {};
        for (const event of ALLOWED_EVENTS) {
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

    private isReply(
        type: 'messageCreate' | 'messageReactionAdd',
        original: Message,
        reply: Message,
        args?: any[],
    ): boolean {
        if (type === 'messageCreate') {
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

        if (original.id !== reply.id) {
            return false;
        }

        const userId = args[1];
        if (this.client.user.id === userId) {
            return false;
        }

        return true;
    }
}
