import {JsonProperty} from 'json-typescript-mapper';

export default class EmbedVideo {
    @JsonProperty('url')
    public url: string = null;

    @JsonProperty('height')
    public height: number = null;

    @JsonProperty('width')
    public width: number = null;

    constructor(init?: Partial<EmbedVideo>) {
        Object.assign(this, init);
    }
}
