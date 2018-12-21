enum CommandError {
    // Search
    UnknownCommand = 1,

    // Parse
    ParseFailed,
    BadArgCount,

    // Parse (type reader)
    // CastFailed,
    ObjectNotFound,
    MultipleMatches,

    // Preconditions
    UnmetPrecondition,

    // Execute
    Exception,
}

export default CommandError;
