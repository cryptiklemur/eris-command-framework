# Eris Command Framework

This framework is based around the idea of `PluginInterface`, and `CommandInterfaces`.

a Plugin (that implements `PluginInterface`) has Commands, that are annotated by `@Command()`

### Usage

##### Requirements

* TypeORM
* Inversify


```
import {CommandFramework, Interfaces, types} from 'eris-command-framework';

const container = new Container({defaultScope: 'singleton'});
const commandFramework = new CommandFramework(container, {prefix: '|'}); // Prefix is required

const connection: Connection = await createConnection(
    {
        autoSchemaSync: true,
        driver:         {
            database: process.env.DATABASE_NAME,
            host:     process.env.DATABASE_HOST,
            port:     process.env.DATABASE_PORT,
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            type:     "mysql",
            extra:    {
                supportBigNumbers: true,
                bigNumberStrings:  true,
            },
        },
        entities:       [
            // Your entities here,
            ...commandFramework.getEntities()
        ],
    },
);


container.bind<Connection>(types.Connection).toConstantValue(connection);

const plugins: Interfaces.PluginInterface[] = [
    // Array of PluginInterfaces
];

// Finish setting up your container
await commandFramework.Initialize(plugins);
```
