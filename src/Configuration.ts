import {injectable} from 'inversify';

@injectable()
export default class Configuration {
    public readonly prefix: string;
    public readonly onMessageUpdate: boolean = true;
    public readonly owners: string[] = [];

    public constructor(init?: Configuration) {
        Object.assign(this, init);
    }
}
