import {Channel, Client, GuildChannel} from 'eris';
import {Dictionary} from 'typescript-collections';

import CommandContext from '../CommandContext';
import CommandError from '../CommandError';
import TypeReaderResult from '../Result/TypeReaderResult';
import TypeReaderValue from '../Result/TypeReaderValue';
import AbstractTypeReader from './AbstractTypeReader';

export default class ChannelTypeReader extends AbstractTypeReader {
    private static AddResult(results: Dictionary<string, TypeReaderValue>, channel: Channel, score: number): void {
        if (channel && !results.containsKey(channel.id)) {
            results.setValue(channel.id, new TypeReaderValue(channel, score));
        }
    }

    public GetTypes(): any[] {
        return [Channel, GuildChannel];
    }

    public Read(client: Client, context: CommandContext, input: string): TypeReaderResult {
        const results: Dictionary<string, TypeReaderValue> = new Dictionary<string, TypeReaderValue>();
        let guildChannels: GuildChannel[]                  = null;

        if (context.Guild) {
            guildChannels = context.Guild.channels.map((x) => x);
        }

        // By Mention (1.0)
        let mentionRegex: RegExp = /^<#(\d+)>$/;
        if (mentionRegex.test(input)) {
            if (context.Guild) {
                ChannelTypeReader.AddResult(
                    results,
                    guildChannels.find((x) => x.id === mentionRegex.exec(input)[1]),
                    1.00,
                );
            } else {
                client.guilds.filter(
                    (x) => !!x.channels.find((y) => y.id === mentionRegex.exec(input)[1]),
                ).forEach(
                    (x) => {
                        ChannelTypeReader.AddResult(
                            results, x.channels.find((y) => y.id === mentionRegex.exec(input)[1]), 1.00,
                        );
                    },
                );
            }
        }

        // By ID (0.9)
        let idRegex: RegExp = /^(\d+)$/;
        if (idRegex.test(input)) {
            if (context.Guild) {
                ChannelTypeReader.AddResult(results, guildChannels.find((x) => x.id === input), 0.90);
            } else {
                client.guilds.filter(
                    (x) => !!x.channels.find((y) => y.id === mentionRegex.exec(input)[1]),
                ).forEach(
                    (x) => {
                        ChannelTypeReader.AddResult(
                            results, x.channels.find((y) => y.id === input), 0.90,
                        );
                    },
                );
            }
        }

        // By Name (0.75-0.85)
        for (let channel of guildChannels.filter((x) => x.name.toLocaleLowerCase() === input.toLocaleLowerCase())) {
            ChannelTypeReader.AddResult(results, channel, channel.name === input ? 0.85 : 0.75);
        }

        if (results.size() > 0) {
            return TypeReaderResult.FromSuccess(results.values());
        }

        return TypeReaderResult.FromError(CommandError.ObjectNotFound, 'Channel not found.');
    }
};
