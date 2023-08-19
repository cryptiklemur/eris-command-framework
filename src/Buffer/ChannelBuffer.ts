import {Mutex} from 'await-semaphore';
import {TextableChannel} from 'eris';
import {setInterval} from 'timers';

const mutex: Mutex = new Mutex();

export default class ChannelBuffer<T> {
    private messages: T[] = [];

    constructor(private channel: TextableChannel, tick: (channel: TextableChannel, messages: T[]) => Promise<void>, interval: number = 1000) {
        setInterval(
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            async (): Promise<void> => {
                const release = await mutex.acquire();

                const messages: T[]    = this.messages.slice();
                this.messages.length = 0;

                release();

                if (messages.length === 0) {
                    return;
                }

                return tick(this.channel, messages);
            },
            interval,
        );
    }

    public addItem(obj: T): void {
        void mutex.acquire().then((release) => {
            this.messages.push(obj);

            release();
        });
    }
};
