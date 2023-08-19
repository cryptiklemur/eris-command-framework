import {classToPlain} from 'class-transformer';
import {EmbedOptions} from 'eris';

import EmbedAuthor from './EmbedAuthor';
import EmbedField from './EmbedField';
import EmbedFooter from './EmbedFooter';
import EmbedImage from './EmbedImage';
import EmbedProvider from './EmbedProvider';
import EmbedThumbnail from './EmbedThumbnail';
import EmbedVideo from './EmbedVideo';

export default class Embed {
    public title: string;

    public type: string;

    public description: string;

    public url: string;

    public color?: number;

    public timestamp?: Date;

    public author: EmbedAuthor = new EmbedAuthor();

    public footer: EmbedFooter = new EmbedFooter();

    public video: EmbedVideo = new EmbedVideo();

    public thumbnail: EmbedThumbnail = new EmbedThumbnail();

    public image: EmbedImage = new EmbedImage();

    public provider: EmbedProvider = new EmbedProvider();

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
        this.author    = this.author instanceof EmbedAuthor ? this.author : new EmbedAuthor(this.author);
        this.footer    = this.footer instanceof EmbedFooter ? this.footer : new EmbedFooter(this.footer);
        this.image     = this.image instanceof EmbedImage ? this.image : new EmbedImage(this.image);
        this.provider  = this.provider instanceof EmbedProvider ? this.provider : new EmbedProvider(this.provider);
        this.thumbnail = this.thumbnail instanceof EmbedThumbnail ? this.thumbnail : new EmbedThumbnail(this.thumbnail);
        this.video     = this.video instanceof EmbedVideo ? this.video : new EmbedVideo(this.video);
        this.fields    = this.fields.map((f: EmbedField) => f instanceof EmbedField ? f : new EmbedField(f));

        return classToPlain(this);
    }
};
