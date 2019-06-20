export default class EmbedVideo {
    public url: string = null;

    public height: number = null;

    public width: number = null;

    constructor(init?: Partial<EmbedVideo>) {
        Object.assign(this, init);
    }
}
