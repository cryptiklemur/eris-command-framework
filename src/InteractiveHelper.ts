import {Client, Message, User} from 'eris';
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
    'messageDelete',
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
        user: User,
        timeout: number = 30 * 60 * 1000,
    ): EventEmitter {
        let emitter = new EventEmitter();
        const listener = (type) => (msg, ...args) => {
            if (this.isReply(type, message, msg, user, args)) {
                emitter.emit(type, msg, user, ...args);
            }
        };

        const listeners = {};
        for (const event of ALLOWED_EVENTS) {
            const eventListener = listener(event);
            listeners[event]    = eventListener;
            this.client.on(event, eventListener);

            setTimeout(
                () => {
                    if (emitter) {
                        emitter.emit('close', true);
                    }
                },
                timeout,
            );
        }

        emitter.once('close', (inactive) => {
            emitter.removeAllListeners();
            emitter = undefined;
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
        user: User,
        args?: any[],
    ): boolean {
        if (type === 'messageCreate') {
            if (reply.content.indexOf(this.configuration.prefix) === 0) {
                return false;
            }

            if (user.id !== reply.author.id) {
                return false;
            }

            if (original.channel && !reply.channel) {
                return false;
            }

            if (!original.channel && reply.channel) {
                return false;
            }

            if (original.channel && reply.channel && original.channel.id !== reply.channel.id) {
                return false;
            }

            return true;
        }

        if (original.id !== reply.id) {
            return false;
        }

        return args[1] === user.id;
    }
}
