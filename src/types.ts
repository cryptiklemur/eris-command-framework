const Types = {
    command:           {
        handler: 'command.handler',
        parser:  'command.parser',
        service: 'command.service',
    },
    configuration:     'configuration',
    connection:        'connection',
    discordClient:     'discordClient',
    discordRestClient: 'discordRestClient',
    environment:       'environment',
    eventEmitter:      'eventEmitter',
    logger:            'logger',
    interactiveHelper: 'interactiveHelper',
    messageBuffer:     'messageBuffer',
    plugin:            'plugin',
    security:          {
        authorizer: 'security.authorizer',
    },
};

export default Types;
