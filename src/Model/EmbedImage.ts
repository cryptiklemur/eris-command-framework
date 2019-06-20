import {Expose} from 'class-transformer';

export default class EmbedImage {
    public url: string;

    @Expose({name: 'proxy_url'})
    public proxyUrl?: string;

    public height?: number;

    public width?: number;

    constructor(init?: Partial<EmbedImage>) {
        Object.assign(this, init);
    }
}
