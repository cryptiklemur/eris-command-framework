import Embed from '../Model/Embed';

export default class EmbedBuilder {
    public get title(): string {
        return this.embed.title;
    }

    public set title(value: string) {
        this.embed.title = value;
    }

    public get description(): string {
        return this.embed.description;
    }

    public set description(value: string) {
        this.embed.description = value;
    }

    public get url(): string {
        return this.embed.url;
    }

    public set url(value: string) {
        this.embed.url = value;
    }

    public get thumbnailUrl(): string {
        return this.embed.thumbnail.url;
    }

    public set thumbnailUrl(value: string) {
        this.embed.thumbnail.url = value;
    }

    public get imageUrl(): string {
        return this.embed.image.url;
    }

    public set imageUrl(value: string) {
        this.embed.image.url = value;
    }

    public get timestamp(): Date {
        return this.embed.timestamp;
    }

    public set timestamp(value: Date) {
        this.embed.timestamp = value;
    }

    public get color(): number {
        return this.embed.color;
    }

    public set color(value: number) {
        this.embed.color = value;
    }

    private readonly embed: Embed = new Embed();
};
