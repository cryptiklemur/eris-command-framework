import {JsonProperty} from "json-typescript-mapper";

export default class EmbedFooter {
    @JsonProperty("text")
    public Text?: string;
    @JsonProperty("icon_url")
    public IconUrl?: string;
    @JsonProperty("proxy_icon_url")
    public ProxyIconUrl?: string;

    constructor(init?: Partial<EmbedFooter>) {
        Object.assign(this, init);
    }
}
