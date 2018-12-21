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
    public title: string;

    @JsonProperty('type')
    public type: string;

    @JsonProperty('description')
    public description: string;

    @JsonProperty('url')
    public url: string;

    @JsonProperty('color')
    public color?: number;

    @JsonProperty('timestamp')
    public timestamp?: Date;

    @JsonProperty({name: 'author', clazz: EmbedAuthor})
    public author: EmbedAuthor = new EmbedAuthor();

    @JsonProperty({name: 'footer', clazz: EmbedFooter})
    public footer: EmbedFooter = new EmbedFooter();

    @JsonProperty({name: 'video', clazz: EmbedVideo})
    public video: EmbedVideo = new EmbedVideo();

    @JsonProperty({name: 'thumbnail', clazz: EmbedThumbnail})
    public thumbnail: EmbedThumbnail = new EmbedThumbnail();

    @JsonProperty({name: 'image', clazz: EmbedImage})
    public image: EmbedImage = new EmbedImage();

    @JsonProperty({name: 'provider', clazz: EmbedProvider})
    public provider: EmbedProvider = new EmbedProvider();

    @JsonProperty({name: 'fields', clazz: EmbedField})
    public fields: EmbedField[] = [];

    public constructor(init?: Partial<Embed>) {
        Object.assign(this, init);
    }

    public withField(action: (field: EmbedField) => void): Embed {
        const embedField: EmbedField = new EmbedField();
        action(embedField);

        this.fields.push(embedField);

        return this;
    }

    public withColor(color: number): Embed {
        this.color = color;

        return this;
    }

    public withTitle(title: string): Embed {
        this.title = title;

        return this;
    }

    public serialize(): EmbedOptions {
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

        this.author    = this.author instanceof EmbedAuthor ? this.author : new EmbedAuthor(this.author);
        this.footer    = this.footer instanceof EmbedFooter ? this.footer : new EmbedFooter(this.footer);
        this.image     = this.image instanceof EmbedImage ? this.image : new EmbedImage(this.image);
        this.provider  = this.provider instanceof EmbedProvider ? this.provider : new EmbedProvider(this.provider);
        this.thumbnail = this.thumbnail instanceof EmbedThumbnail ? this.thumbnail : new EmbedThumbnail(this.thumbnail);
        this.video     = this.video instanceof EmbedVideo ? this.video : new EmbedVideo(this.video);
        this.fields    = this.fields.map((f: EmbedField) => f instanceof EmbedField ? f : new EmbedField(f));

        return serialize(this);
    }
};
