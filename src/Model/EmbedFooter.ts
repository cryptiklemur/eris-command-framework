import {JsonProperty} from 'json-typescript-mapper';

export default class EmbedFooter {
    @JsonProperty('text')
    public text?: string;

    @JsonProperty('icon_url')
    public iconUrl?: string;

    @JsonProperty('proxy_icon_url')
    public proxyIconUrl?: string;

    constructor(init?: Partial<EmbedFooter>) {
        Object.assign(this, init);
    }
}
