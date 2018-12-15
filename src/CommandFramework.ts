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
    constructor(private container: Container, configuration: Configuration) {
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

    public async Initialize(plugins: { [name: string]: Interfaces.PluginInterface } = {}): Promise<void> {
        for (const name of Object.keys(plugins)) {
            const plugin: PluginInterface = plugins[name];
            this.container.bind<Interfaces.PluginInterface>(Types.Plugin).to(plugin as any).whenTargetNamed(name);
            (plugin).AddToContainer(this.container);
        }

        await this.container.get<Authorizer>(Types.Security.Authorizer).Initialize();
        await this.container.get<CommandService>(Types.Command.Service).Initialize(plugins);
        await this.container.get<CommandHandler>(Types.Command.Handler).Install();
    }

    public getEntities(): any[] {
        return [
            Permission,
        ];
    }
}
