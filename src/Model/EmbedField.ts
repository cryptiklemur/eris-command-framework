import {JsonProperty} from "json-typescript-mapper";

export default class EmbedField {
    @JsonProperty("name")
    public Name: string;
    @JsonProperty("value")
    public Value: string;
    @JsonProperty("inline")
    public Inline?: boolean = false;

    constructor(init?: Partial<EmbedField>) {
        Object.assign(this, init);
    }
}
