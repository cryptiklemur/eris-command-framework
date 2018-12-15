import {JsonProperty} from "json-typescript-mapper";

export default class EmbedProvider {
    @JsonProperty("name")
    public Name: string;
    @JsonProperty("url")
    public Url: string;

    constructor(init?: Partial<EmbedProvider>) {
        Object.assign(this, init);
    }
}
