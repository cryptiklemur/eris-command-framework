const Types = {
    command:           {
        handler: Symbol('command.handler'),
        parser:  Symbol('command.parser'),
        service: Symbol('command.service'),
    },
    configuration:     Symbol('configuration'),
    connection:        Symbol('Connection'),
    discordClient:     Symbol('discordClient'),
    discordRestClient: Symbol('discordRestClient'),
    environment:       Symbol('environment'),
    eventEmitter:      Symbol('eventEmitter'),
    logger:            Symbol('logger'),
    interactiveHelper: Symbol('interactive_helper'),
    messageBuffer:     Symbol('messageBuffer'),
    plugin:            Symbol('Plugin'),
    security:          {
        authorizer: Symbol('security.authorizer'),
    },
};

export default Types;
