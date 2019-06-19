import {Channel, Client, GuildChannel} from 'eris';

import CommandContext from '../CommandContext';
import CommandError from '../CommandError';
import TypeReaderResult from '../Result/TypeReaderResult';
import TypeReaderValue from '../Result/TypeReaderValue';
import Dictionary from '../Types/Dictionary';
import AbstractTypeReader from './AbstractTypeReader';

export default class ChannelTypeReader extends AbstractTypeReader {
    private static addResult(results: Dictionary<string, TypeReaderValue>, channel: Channel, score: number): void {
        if (channel && !results.hasOwnProperty(channel.id)) {
            results[channel.id] = new TypeReaderValue(channel, score);
        }
    }

    public getTypes(): any[] {
        return [Channel, GuildChannel];
    }

    public read(client: Client, context: CommandContext, input: string): TypeReaderResult {
        const results: Dictionary<string, TypeReaderValue> = {};
        let guildChannels: GuildChannel[]                  = null;

        if (context.guild) {
            guildChannels = context.guild.channels.map((x) => x);
        }

        // By Mention (1.0)
        let mentionRegex: RegExp = /^<#(\d+)>$/;
        if (mentionRegex.test(input)) {
            if (context.guild) {
                ChannelTypeReader.addResult(
                    results,
                    guildChannels.find((x) => x.id === mentionRegex.exec(input)[1]),
                    1.00,
                );
            }

            if (Object.keys(results).length === 0) {
                client.guilds.filter(
                    (x) => !!x.channels.find((y) => y.id === mentionRegex.exec(input)[1]),
                ).forEach(
                    (x) => {
                        ChannelTypeReader.addResult(
                            results, x.channels.find((y) => y.id === mentionRegex.exec(input)[1]), 1.00,
                        );
                    },
                );
            }
        }

        // By ID (0.9)
        let idRegex: RegExp = /^(\d+)$/;
        if (idRegex.test(input)) {
            if (context.guild) {
                ChannelTypeReader.addResult(results, guildChannels.find((x) => x.id === input), 0.90);
            }

            if (Object.keys(results).length === 0) {
                client.guilds.filter(
                    (x) => !!x.channels.find((y) => y.id === input),
                ).forEach(
                    (x) => {
                        ChannelTypeReader.addResult(
                            results, x.channels.find((y) => y.id === input), 0.90,
                        );
                    },
                );
            }
        }

        // By name (0.75-0.85)
        // tslint:disable-next-line:max-line-length
        for (let channel of guildChannels.filter((x) => x.name && (x.name.toLocaleLowerCase() === input.toLocaleLowerCase()))) {
            ChannelTypeReader.addResult(results, channel, channel.name === input ? 0.85 : 0.75);
        }

        if (Object.keys(results).length > 0) {
            return TypeReaderResult.fromSuccess(Object.values(results));
        }

        return TypeReaderResult.fromError(CommandError.ObjectNotFound, 'channel not found.');
    }
};
