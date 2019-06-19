import {Client, User} from 'eris';

import CommandContext from '../CommandContext';
import CommandError from '../CommandError';
import TypeReaderResult from '../Result/TypeReaderResult';
import TypeReaderValue from '../Result/TypeReaderValue';
import Dictionary from '../Types/Dictionary';
import AbstractTypeReader from './AbstractTypeReader';

export default class UserTypeReader extends AbstractTypeReader {
    private static addResult(results: Dictionary<string, TypeReaderValue>, user: User, score: number): void {
        if (user && !results.hasOwnProperty(user.id)) {
            results[user.id] = new TypeReaderValue(user, score);
        }
    }

    public getTypes(): any[] {
        return [User];
    }

    public read(client: Client, context: CommandContext, input: string): TypeReaderResult {
        const results: Dictionary<string, TypeReaderValue> = {};
        let guildUsers: User[]                             = null;

        if (context.guild) {
            guildUsers = context.guild.members.map((x) => x.user);
        }

        // By Mention (1.0)
        let mentionRegex: RegExp = /^<@!?(\d+)>$/;
        if (mentionRegex.test(input)) {
            if (context.guild) {
                UserTypeReader.addResult(results, guildUsers.find((x) => x.id === mentionRegex.exec(input)[1]), 1.00);
            } else {
                UserTypeReader.addResult(results, client.users.find((x) => x.id === mentionRegex.exec(input)[1]), 1.00);
            }
        }

        // By ID (0.9)
        let idRegex: RegExp = /^(\d+)$/;
        if (idRegex.test(input)) {
            if (context.guild) {
                UserTypeReader.addResult(results, guildUsers.find((x) => x.id === input), 0.90);
            } else {
                UserTypeReader.addResult(results, client.users.find((x) => x.id === input), 0.90);
            }
        }

        // By Username + Discrim (0.7-0.85)
        let index: number = input.lastIndexOf('#');
        if (index > 0) {
            const username: string = input.substring(0, index);
            const discrim: string  = input.substring(index + 1);

            let globalUser: User = client.users.find(
                (x) => x.discriminator === discrim && x.username.toLowerCase() === username.toLowerCase(),
            );
            let guildUser: User  = guildUsers.find(
                (x) => x.discriminator === discrim && x.username.toLowerCase() === username.toLowerCase(),
            );

            if (globalUser) {
                UserTypeReader.addResult(results, globalUser, globalUser.username === username ? 0.80 : 0.70);
            }

            if (guildUser) {
                UserTypeReader.addResult(results, guildUser, guildUser.username === username ? 0.85 : 0.75);
            }
        }

        // By Username (0.5-0.65)
        for (let user of client.users.filter((x) => x.username.toLowerCase() === input.toLowerCase())) {
            UserTypeReader.addResult(results, user, user.username === input ? 0.60 : 0.50);
        }
        for (let user of guildUsers.filter((x) => x.username.toLowerCase() === input.toLowerCase())) {
            UserTypeReader.addResult(results, user, user.username === input ? 0.65 : 0.55);
        }

        // By Nickname (0.5-0.65)
        if (context.guild) {
            for (let user of context.guild.members.filter(
                (x) => x.nick && x.nick.toLowerCase() === input.toLowerCase(),
            )) {
                UserTypeReader.addResult(results, user.user, user.username === input ? 0.65 : 0.55);
            }
        }

        if (Object.keys(results).length > 0) {
            return TypeReaderResult.fromSuccess(Object.values(results));
        }

        return TypeReaderResult.fromError(CommandError.ObjectNotFound, 'user not found.');
    }
};
