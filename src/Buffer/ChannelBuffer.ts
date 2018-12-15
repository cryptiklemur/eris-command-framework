import {Mutex} from 'await-semaphore';
import {Channel} from 'eris';
import {setInterval} from 'timers';

const mutex: Mutex = new Mutex();

export default class ChannelBuffer<T> {
    private _messages: T[] = [];

    constructor(private _channel: Channel, tick: Function, interval: number = 1000) {
        setInterval(
            async () => {
                const release: any = await mutex.acquire();

                let messages: T[]     = this._messages.slice();
                this._messages.length = 0;

                release();

                if (messages.length === 0) {
                    return;
                }

                tick(this._channel, messages);
            },
            interval,
        );
    }

    public addItem(obj: T): void {
        mutex.acquire().then((release) => {
            this._messages.push(obj);

            release();
        });
    }
};
