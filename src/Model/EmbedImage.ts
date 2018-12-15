import {JsonProperty} from "json-typescript-mapper";

export default class EmbedImage {
    @JsonProperty("url")
    public Url: string;
    @JsonProperty("proxy_url")
    public ProxyUrl?: string;
    @JsonProperty("height")
    public Height?: number;
    @JsonProperty("width")
    public Width?: number;

    constructor(init?: Partial<EmbedImage>) {
        Object.assign(this, init);
    }
}
