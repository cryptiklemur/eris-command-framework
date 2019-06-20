import {Expose} from 'class-transformer';

export default class EmbedThumbnail {
    public url: string;

    @Expose({name: 'proxy_url'})
    public proxyUrl?: string;

    public height?: number;

    public width?: number;

    constructor(init?: Partial<EmbedThumbnail>) {
        Object.assign(this, init);
    }
};
