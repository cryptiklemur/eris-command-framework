export default class EmbedField {
    public name: string;

    public value: string;

    public inline?: boolean = false;

    constructor(init?: Partial<EmbedField>) {
        Object.assign(this, init);
    }
}
