export default class StringBuilder {
    get length() {
        return this._items.length;
    }

    set length(value) {
        this._items.length = value;
    }

    constructor(private _items: string[] = []) {
    }

    public Append(...strings: string[]): StringBuilder {
        strings.forEach((s) => this._items.push(s));

        return this;
    }

    public AppendLine(...strings: string[]): StringBuilder {
        strings.forEach((s) => this._items.push(s));
        this._items.push('\n');

        return this;
    }

    public Clear(): StringBuilder {
        this.length = 0;

        return this;
    }

    public toString() {
        return this._items.join('');
    }
};
