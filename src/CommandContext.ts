import {Client, Guild, GuildChannel, Member, Message, TextableChannel, User} from 'eris';

export default class CommandContext {
    public Guild?: Guild;
    public Channel: TextableChannel;
    public User: User;
    public Member: Member;

    constructor(public Client: Client, public Message: Message) {
        this.Channel = Message.channel;
        this.Guild   = (this.Channel as GuildChannel).guild;
        this.User    = Message.author;
        this.Member  = Message.member;
    }
};
