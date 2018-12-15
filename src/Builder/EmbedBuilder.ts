import Embed from '../Model/Embed';

export default class EmbedBuilder {
    public get Title() {
        return this._embed.Title;
    }

    public set Title(value: string) {
        this._embed.Title = value;
    }

    public get Description() {
        return this._embed.Description;
    }

    public set Description(value: string) {
        this._embed.Description = value;
    }

    public get Url() {
        return this._embed.Url;
    }

    public set Url(value: string) {
        this._embed.Url = value;
    }

    public get ThumbnailUrl() {
        return this._embed.Thumbnail.Url;
    }

    public set ThumbnailUrl(value: string) {
        this._embed.Thumbnail.Url = value;
    }

    public get ImageUrl() {
        return this._embed.Image.Url;
    }

    public set ImageUrl(value: string) {
        this._embed.Image.Url = value;
    }

    public get Timestamp() {
        return this._embed.Timestamp;
    }

    public set Timestamp(value: Date) {
        this._embed.Timestamp = value;
    }

    public get Color() {
        return this._embed.Color;
    }

    public set Color(value: number) {
        this._embed.Color = value;
    }

    private readonly _embed: Embed = new Embed();
};
