import {JsonProperty} from "json-typescript-mapper";

export default class EmbedAuthor {
    @JsonProperty("name")
    public Name?: string;
    @JsonProperty("url")
    public Url?: string;
    @JsonProperty("icon_url")
    public IconUrl?: string;
    @JsonProperty("proxy_icon_url")
    public ProxyIconUrl?: string;

    constructor(init?: Partial<EmbedAuthor>) {
        Object.assign(this, init);
    }
}
