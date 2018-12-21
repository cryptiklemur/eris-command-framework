import {TextableChannel} from 'eris';
import {injectable} from 'inversify';
import ChannelBuffer from './ChannelBuffer';

@injectable()
export default class MessageBuffer {
    private readonly buffers: Array<ChannelBuffer<string>> = [];

    public addItem(channel: TextableChannel, message: string): void {
        if (!this.buffers[channel.id]) {
            this.buffers[channel.id] = new ChannelBuffer<string>(
                channel,
                async (chl, messages) => {
                    let builder: string = '';
                    for (let msg of messages) {
                        if (builder.length + msg.length > 2000) {
                            await chl.createMessage(builder);
                            builder = '';
                        }

                        builder += `${msg}\n`;
                    }

                    await channel.createMessage(builder);
                },
            );
        }

        this.buffers[channel.id].addItem(message);
    }
};
