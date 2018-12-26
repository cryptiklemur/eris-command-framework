import {Client, Message} from 'eris';
import {EventEmitter} from 'events';
import {inject, injectable} from 'inversify';

import Types from './types';

@injectable()
export default class InteractiveHelper {
    private static isReply(messageOne: Message, messageTwo: Message): boolean {
        if (messageOne.author.id !== messageTwo.author.id) {
            return false;
        }

        if (messageOne.channel) {
            if (!messageTwo.channel || messageOne.channel.id !== messageTwo.channel.id) {
                return false;
            }
        }

        return !(!messageOne.channel && messageTwo.channel);
    }

    public constructor(@inject(Types.discordClient) private client: Client) {
    }

    public listenForReplies(
        message: Message,
        timeout: number = 30 * 60 * 1000,
    ): EventEmitter {
        const emitter = new EventEmitter();
        const listener = (type) => (msg, ...arg) => {
            if (InteractiveHelper.isReply(arg[0], message)) {
                emitter.emit(type, msg, ...arg);
            }
        };

        const listeners = {};
        for (const event of ['messageCreate', 'messageReactionAdd']) {
            const eventListener = listener(event);
            listeners[event] = eventListener;
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
}
