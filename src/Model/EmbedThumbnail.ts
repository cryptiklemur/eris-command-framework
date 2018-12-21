import {JsonProperty} from 'json-typescript-mapper';

export default class EmbedThumbnail {
    @JsonProperty('url')
    public url: string;

    @JsonProperty('proxy_url')
    public proxyUrl?: string;

    @JsonProperty('height')
    public height?: number;

    @JsonProperty('width')
    public width?: number;

    constructor(init?: Partial<EmbedThumbnail>) {
        Object.assign(this, init);
    }
};
