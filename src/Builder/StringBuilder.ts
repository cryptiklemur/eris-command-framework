/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default class StringBuilder {
    get length(): number {
        return this._items.length;
    }

    set length(value) {
        this._items.length = value;
    }

    constructor(private _items: string[] = []) {
    }

    public append(...strings: string[]): StringBuilder {
        strings.forEach((s) => this._items.push(s));

        return this;
    }

    public appendLine(...strings: string[]): StringBuilder {
        strings.forEach((s) => this._items.push(s));
        this._items.push('\n');

        return this;
    }

    public clear(): StringBuilder {
        this.length = 0;

        return this;
    }

    public toString(): string {
        return this._items.join('');
    }
};
