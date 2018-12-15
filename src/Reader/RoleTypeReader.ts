import {Client, Role} from 'eris';
import {Dictionary} from 'typescript-collections';

import CommandContext from '../CommandContext';
import CommandError from '../CommandError';
import TypeReaderResult from '../Result/TypeReaderResult';
import TypeReaderValue from '../Result/TypeReaderValue';
import AbstractTypeReader from './AbstractTypeReader';

export default class RoleTypeReader extends AbstractTypeReader {
    private static AddResult(results: Dictionary<string, TypeReaderValue>, role: Role, score: number): void {
        if (role && !results.containsKey(role.id)) {
            results.setValue(role.id, new TypeReaderValue(role, score));
        }
    }

    public GetTypes(): any[] {
        return [Role];
    }

    public Read(client: Client, context: CommandContext, input: string): TypeReaderResult {
        const results: Dictionary<string, TypeReaderValue> = new Dictionary<string, TypeReaderValue>();
        let guildRoles: Role[]                             = context.Guild.roles.map((x) => x);

        // By Mention (1.0)
        let mentionRegex: RegExp = /^<@&(\d+)>$/;
        if (mentionRegex.test(input)) {
            if (context.Guild) {
                RoleTypeReader.AddResult(
                    results,
                    guildRoles.find((x) => x.id === mentionRegex.exec(input)[1]),
                    1.00,
                );
            } else {
                client.guilds.filter(
                    (x) => !!x.roles.find((y) => y.id === mentionRegex.exec(input)[1]),
                ).forEach(
                    (x) => {
                        RoleTypeReader.AddResult(
                            results, x.roles.find((y) => y.id === mentionRegex.exec(input)[1]), 1.00,
                        );
                    },
                );
            }
        }

        // By ID (0.9)
        let idRegex: RegExp = /^(\d+)$/;
        if (idRegex.test(input)) {
            if (context.Guild) {
                RoleTypeReader.AddResult(results, guildRoles.find((x) => x.id === input), 0.90);
            } else {
                client.guilds.filter(
                    (x) => !!x.roles.find((y) => y.id === mentionRegex.exec(input)[1]),
                ).forEach(
                    (x) => {
                        RoleTypeReader.AddResult(
                            results, x.roles.find((y) => y.id === input), 0.90,
                        );
                    },
                );
            }
        }

        // By Name (0.75-0.85)
        for (let role of guildRoles.filter((x) => x.name.toLocaleLowerCase() === input.toLocaleLowerCase())) {
            RoleTypeReader.AddResult(results, role, role.name === input ? 0.85 : 0.75);
        }

        if (results.size() > 0) {
            return TypeReaderResult.FromSuccess(results.values());
        }

        return TypeReaderResult.FromError(CommandError.ObjectNotFound, 'Role not found.');
    }
};
