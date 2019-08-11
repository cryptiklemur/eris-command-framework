const Types = {
    command:           {
        handler: 'command.handler',
        parser:  'command.parser',
        service: 'command.service',
    },
    configuration:     'configuration',
    connection:        'Connection',
    discordClient:     'discordClient',
    discordRestClient: 'discordRestClient',
    environment:       'environment',
    eventEmitter:      'eventEmitter',
    logger:            'logger',
    interactiveHelper: 'interactive_helper',
    messageBuffer:     'messageBuffer',
    plugin:            'Plugin',
    security:          {
        authorizer: 'security.authorizer',
    },
};

export default Types;
