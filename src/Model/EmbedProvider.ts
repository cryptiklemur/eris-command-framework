import {JsonProperty} from 'json-typescript-mapper';

export default class EmbedProvider {
    @JsonProperty('name')
    public name: string;

    @JsonProperty('url')
    public url: string;

    constructor(init?: Partial<EmbedProvider>) {
        Object.assign(this, init);
    }
}
