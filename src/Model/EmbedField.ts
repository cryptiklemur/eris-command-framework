import {JsonProperty} from 'json-typescript-mapper';

export default class EmbedField {
    @JsonProperty('name')
    public name: string;

    @JsonProperty('value')
    public value: string;

    @JsonProperty('inline')
    public inline?: boolean = false;

    constructor(init?: Partial<EmbedField>) {
        Object.assign(this, init);
    }
}
