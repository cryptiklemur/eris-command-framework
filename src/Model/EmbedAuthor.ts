import {Expose} from 'class-transformer';

export default class EmbedAuthor {
    public name?: string;

    public url?: string;

    @Expose({name: 'icon_url'})
    public iconUrl?: string;

    @Expose({name: 'proxy_icon_url'})
    public proxyIconUrl?: string;

    constructor(init?: Partial<EmbedAuthor>) {
        Object.assign(this, init);
    }
}
