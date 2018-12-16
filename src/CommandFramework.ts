import {Container} from 'inversify';
import {Logger} from 'winston';
import * as NullLogger from 'winston-null';
import MessageBuffer from './Buffer/MessageBuffer';
import CommandHandler from './CommandHandler';
import CommandParser from './CommandParser';
import CommandService from './CommandService';

import Configuration from './Configuration';
import Permission from './Entity/Permission';
import {Interfaces} from './Interfaces';
import Authorizer from './Security/Authorizer';
import Types from './types';
import PluginInterface = Interfaces.PluginInterface;

export default class CommandFramework {
    constructor(
        private container: Container,
        configuration: Configuration,
        private plugins: { [name: string]: Interfaces.PluginInterface } = {},
    ) {
        container.bind<Configuration>(Types.Configuration).toConstantValue(configuration);
        if (!container.isBound(Types.Logger)) {
            container.bind<Logger>(Types.Logger).to(NullLogger);
        }

        container.bind<MessageBuffer>(Types.MessageBuffer).to(MessageBuffer);
        container.bind<CommandService>(Types.Command.Service).to(CommandService);
        container.bind<CommandHandler>(Types.Command.Handler).to(CommandHandler);
        container.bind<CommandParser>(Types.Command.Parser).to(CommandParser);
        container.bind<Authorizer>(Types.Security.Authorizer).to(Authorizer);
    }

    public async Initialize(): Promise<void> {
        for (const name of Object.keys(this.plugins)) {
            const plugin: PluginInterface = this.plugins[name];
            this.container.bind<Interfaces.PluginInterface>(Types.Plugin).to(plugin as any).whenTargetNamed(name);
            (plugin).AddToContainer(this.container);
        }

        await this.container.get<Authorizer>(Types.Security.Authorizer).Initialize();
        await this.container.get<CommandService>(Types.Command.Service).Initialize(this.plugins);
        await this.container.get<CommandHandler>(Types.Command.Handler).Install();
    }

    public GetEntities(): any[] {
        const pluginEntities = [];
        for (const name of Object.keys(this.plugins)) {
            const plugin = this.plugins[name];

            pluginEntities.push(...plugin.GetEntities());
        }

        return [
            Permission,
            ...pluginEntities,
        ];
    }
}
