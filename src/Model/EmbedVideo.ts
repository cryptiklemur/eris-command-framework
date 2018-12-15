import {JsonProperty} from "json-typescript-mapper";

export default class EmbedVideo {
    @JsonProperty("url")
    public Url: string = null;
    @JsonProperty("height")
    public Height: number = null;
    @JsonProperty("width")
    public Width: number = null;

    constructor(init?: Partial<EmbedVideo>) {
        Object.assign(this, init);
    }
}
