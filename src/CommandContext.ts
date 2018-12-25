import {Client, Guild, GuildChannel, Member, Message, TextableChannel, User} from 'eris';

export default class CommandContext {
    public guild?: Guild;
    public channel: TextableChannel;
    public user: User;
    public member: Member;

    constructor(public client: Client, public message: Message) {
        this.channel = message.channel;
        this.guild   = (this.channel as GuildChannel).guild;
        this.user    = message.author;
        this.member  = message.member;
    }
};
