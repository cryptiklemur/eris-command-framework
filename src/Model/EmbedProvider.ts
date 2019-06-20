export default class EmbedProvider {
    public name: string;

    public url: string;

    constructor(init?: Partial<EmbedProvider>) {
        Object.assign(this, init);
    }
}
