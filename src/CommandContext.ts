import {Client, Guild, GuildChannel, Member, Message, TextableChannel, User} from 'eris';

export default class CommandContext {
    public guild?: Guild;
    public channel: TextableChannel;
    public user: User;
    public member: Member;

    constructor(public Client: Client, public Message: Message) {
        this.channel = Message.channel;
        this.guild   = (this.channel as GuildChannel).guild;
        this.user    = Message.author;
        this.member  = Message.member;
    }
};
