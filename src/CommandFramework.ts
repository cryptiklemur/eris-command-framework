import {Container} from 'inversify';
import {createLogger, format, Logger} from 'winston';

import MessageBuffer from './Buffer/MessageBuffer';
import CommandHandler from './CommandHandler';
import CommandParser from './CommandParser';
import CommandService from './CommandService';
import Configuration from './Configuration';
import Permission from './Entity/Permission';
import {Interfaces} from './Interfaces';
import Authorizer from './Security/Authorizer';
import Types from './types';

export default class CommandFramework {
    constructor(
        private container: Container,
        configuration: Configuration,
        private plugins: { [name: string]: Interfaces.PluginInterface } = {},
    ) {
        container.bind<Configuration>(Types.configuration).toConstantValue(configuration);
        if (!container.isBound(Types.logger)) {
            container.bind<Logger>(Types.logger).toConstantValue(createLogger({
                level:      'info',
                format:     format.combine(
                    format.json(),
                    format.splat(),
                ),
                transports: [],
            }));
        }

        container.bind<MessageBuffer>(Types.messageBuffer).to(MessageBuffer);
        container.bind<CommandService>(Types.command.service).to(CommandService);
        container.bind<CommandHandler>(Types.command.handler).to(CommandHandler);
        container.bind<CommandParser>(Types.command.parser).to(CommandParser);
        container.bind<Authorizer>(Types.security.authorizer).to(Authorizer);
    }

    public async initialize(): Promise<void> {
        for (const name of Object.keys(this.plugins)) {
            const plugin: Interfaces.PluginInterface = this.plugins[name];
            this.container.bind<Interfaces.PluginInterface>(Types.plugin).to(plugin as any).whenTargetNamed(name);
            (plugin as any).addToContainer(this.container);
        }

        await this.container.get<Authorizer>(Types.security.authorizer).initialize();
        await this.container.get<CommandService>(Types.command.service).initialize(this.plugins);
        await this.container.get<CommandHandler>(Types.command.handler).install();
    }

    public getEntities(): any[] {
        const pluginEntities = [];
        for (const name of Object.keys(this.plugins)) {
            const plugin = this.plugins[name];

            pluginEntities.push(...(plugin as any).getEntities());
        }

        return [
            Permission,
            ...pluginEntities,
        ];
    }
}
