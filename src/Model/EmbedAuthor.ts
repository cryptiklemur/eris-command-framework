import {JsonProperty} from 'json-typescript-mapper';

export default class EmbedAuthor {
    @JsonProperty('name')
    public name?: string;

    @JsonProperty('url')
    public url?: string;

    @JsonProperty('icon_url')
    public iconUrl?: string;

    @JsonProperty('proxy_icon_url')
    public proxyIconUrl?: string;

    constructor(init?: Partial<EmbedAuthor>) {
        Object.assign(this, init);
    }
}
