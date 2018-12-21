const Types = {
    command:       {
        handler: Symbol('command.handler'),
        parser:  Symbol('command.parser'),
        service: Symbol('command.service'),
    },
    configuration: Symbol('configuration'),
    connection:    Symbol('Connection'),
    discordClient: Symbol('discordClient'),
    environment:   Symbol('environment'),
    logger:        Symbol('logger'),
    messageBuffer: Symbol('messageBuffer'),
    plugin:        Symbol('Plugin'),
    security:      {
        authorizer: Symbol('security.authorizer'),
    },
};

export default Types;
