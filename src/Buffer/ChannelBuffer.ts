import {Mutex} from 'await-semaphore';
import {Channel} from 'eris';
import {setInterval} from 'timers';

const mutex: Mutex = new Mutex();

export default class ChannelBuffer<T> {
    private messages: T[] = [];

    constructor(private channel: Channel, tick: Function, interval: number = 1000) {
        setInterval(
            async () => {
                const release: any = await mutex.acquire();

                let messages: T[]    = this.messages.slice();
                this.messages.length = 0;

                release();

                if (messages.length === 0) {
                    return;
                }

                tick(this.channel, messages);
            },
            interval,
        );
    }

    public addItem(obj: T): void {
        mutex.acquire().then((release) => {
            this.messages.push(obj);

            release();
        });
    }
};
