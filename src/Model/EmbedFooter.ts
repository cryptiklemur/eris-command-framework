import {Expose} from 'class-transformer';

export default class EmbedFooter {
    public text?: string;

    @Expose({name: 'icon_url'})
    public iconUrl?: string;

    @Expose({name: 'proxy_icon_url'})
    public proxyIconUrl?: string;

    constructor(init?: Partial<EmbedFooter>) {
        Object.assign(this, init);
    }
}
