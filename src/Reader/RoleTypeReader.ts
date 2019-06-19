import {Client, Role} from 'eris';

import CommandContext from '../CommandContext';
import CommandError from '../CommandError';
import TypeReaderResult from '../Result/TypeReaderResult';
import TypeReaderValue from '../Result/TypeReaderValue';
import Dictionary from '../Types/Dictionary';
import AbstractTypeReader from './AbstractTypeReader';

export default class RoleTypeReader extends AbstractTypeReader {
    private static addResult(results: Dictionary<string, TypeReaderValue>, role: Role, score: number): void {
        if (role && !results.hasOwnProperty(role.id)) {
            results[role.id] = new TypeReaderValue(role, score);
        }
    }

    public getTypes(): any[] {
        return [Role];
    }

    public read(client: Client, context: CommandContext, input: string): TypeReaderResult {
        const results: Dictionary<string, TypeReaderValue> = {};
        let guildRoles: Role[]                             = context.guild.roles.map((x) => x);

        // By Mention (1.0)
        let mentionRegex: RegExp = /^<@&(\d+)>$/;
        if (mentionRegex.test(input)) {
            if (context.guild) {
                RoleTypeReader.addResult(
                    results,
                    guildRoles.find((x) => x.id === mentionRegex.exec(input)[1]),
                    1.00,
                );
            } else {
                client.guilds.filter(
                    (x) => !!x.roles.find((y) => y.id === mentionRegex.exec(input)[1]),
                ).forEach(
                    (x) => {
                        RoleTypeReader.addResult(
                            results, x.roles.find((y) => y.id === mentionRegex.exec(input)[1]), 1.00,
                        );
                    },
                );
            }
        }

        // By ID (0.9)
        let idRegex: RegExp = /^(\d+)$/;
        if (idRegex.test(input)) {
            if (context.guild) {
                RoleTypeReader.addResult(results, guildRoles.find((x) => x.id === input), 0.90);
            } else {
                client.guilds.filter(
                    (x) => !!x.roles.find((y) => y.id === mentionRegex.exec(input)[1]),
                ).forEach(
                    (x) => {
                        RoleTypeReader.addResult(
                            results, x.roles.find((y) => y.id === input), 0.90,
                        );
                    },
                );
            }
        }

        // By name (0.75-0.85)
        for (let role of guildRoles.filter((x) => x.name.toLocaleLowerCase() === input.toLocaleLowerCase())) {
            RoleTypeReader.addResult(results, role, role.name === input ? 0.85 : 0.75);
        }

        if (Object.keys(results).length > 0) {
            return TypeReaderResult.fromSuccess(Object.values(results));
        }

        return TypeReaderResult.fromError(CommandError.ObjectNotFound, 'Role not found.');
    }
};
