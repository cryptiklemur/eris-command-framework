import {EmbedOptions} from 'eris';
import {IDecoratorMetaData, JsonProperty} from 'json-typescript-mapper';
import EmbedAuthor from './EmbedAuthor';
import EmbedField from './EmbedField';
import EmbedFooter from './EmbedFooter';
import EmbedImage from './EmbedImage';
import EmbedProvider from './EmbedProvider';
import EmbedThumbnail from './EmbedThumbnail';
import EmbedVideo from './EmbedVideo';

function isTargetType(val: any, type: 'object' | 'string'): boolean {
    return typeof val === type;
}

function isArrayOrArrayClass(clazz: Function): boolean {
    if (clazz === Array) {
        return true;
    }

    return Object.prototype.toString.call(clazz) === '[object Array]';
}

export default class Embed {
    @JsonProperty('title')
    public Title: string;
    @JsonProperty('type')
    public Type: string;
    @JsonProperty('description')
    public Description: string;
    @JsonProperty('url')
    public Url: string;
    @JsonProperty('color')
    public Color?: number;
    @JsonProperty('timestamp')
    public Timestamp?: Date;

    @JsonProperty({name: 'author', clazz: EmbedAuthor})
    public Author: EmbedAuthor = new EmbedAuthor();

    @JsonProperty({name: 'footer', clazz: EmbedFooter})
    public Footer: EmbedFooter = new EmbedFooter();

    @JsonProperty({name: 'video', clazz: EmbedVideo})
    public Video: EmbedVideo = new EmbedVideo();

    @JsonProperty({name: 'thumbnail', clazz: EmbedThumbnail})
    public Thumbnail: EmbedThumbnail = new EmbedThumbnail();

    @JsonProperty({name: 'image', clazz: EmbedImage})
    public Image: EmbedImage = new EmbedImage();

    @JsonProperty({name: 'provider', clazz: EmbedProvider})
    public Provider: EmbedProvider = new EmbedProvider();

    @JsonProperty({name: 'fields', clazz: EmbedField})
    public Fields: EmbedField[] = [];

    public constructor(init?: Partial<Embed>) {
        Object.assign(this, init);
    }

    public WithField(action: (field: EmbedField) => void): Embed {
        const embedField: EmbedField = new EmbedField();
        action(embedField);

        this.Fields.push(embedField);

        return this;
    }

    public WithColor(color: number): Embed {
        this.Color = color;

        return this;
    }

    public WithTitle(title: string): Embed {
        this.Title = title;

        return this;
    }

    public Serialize(): EmbedOptions {
        function serialize(instance: any): any {
            if (!isTargetType(instance, 'object') || isArrayOrArrayClass(instance)) {
                return instance;
            }

            const obj: any = {};
            Object.keys(instance).forEach(
                (key) => {
                    const metadata: IDecoratorMetaData<any>              = getJsonProperty(instance, key);
                    obj[metadata && metadata.name ? metadata.name : key] = serializeProperty(metadata, instance[key]);
                },
            );

            return obj;
        }

        function getJsonProperty<T>(target: any, propertyKey: string): IDecoratorMetaData<T> {
            return Reflect.getMetadata('JsonProperty', target, propertyKey);
        }

        function serializeProperty(metadata: IDecoratorMetaData<any>, prop: any): any {
            if (!metadata || metadata.excludeToJson === true) {
                return;
            }

            if (metadata.customConverter) {
                return metadata.customConverter.toJson(prop);
            }

            if (!metadata.clazz) {
                return prop;
            }

            if (isArrayOrArrayClass(prop)) {
                return prop.map((propItem: any) => serialize(propItem));
            }

            return serialize(prop);
        }

        this.Author    = this.Author instanceof EmbedAuthor ? this.Author : new EmbedAuthor(this.Author);
        this.Footer    = this.Footer instanceof EmbedFooter ? this.Footer : new EmbedFooter(this.Footer);
        this.Image     = this.Image instanceof EmbedImage ? this.Image : new EmbedImage(this.Image);
        this.Provider  = this.Provider instanceof EmbedProvider ? this.Provider : new EmbedProvider(this.Provider);
        this.Thumbnail = this.Thumbnail instanceof EmbedThumbnail ? this.Thumbnail : new EmbedThumbnail(this.Thumbnail);
        this.Video     = this.Video instanceof EmbedVideo ? this.Video : new EmbedVideo(this.Video);
        this.Fields    = this.Fields.map((f: EmbedField) => f instanceof EmbedField ? f : new EmbedField(f));

        return serialize(this);
    }
};
