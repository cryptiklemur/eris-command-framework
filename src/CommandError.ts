enum CommandError {
    // Search
    UnknownCommand = 1,

    // Parse
    ParseFailed,
    BadArgCount,

    // Parse (Type Reader)
    // CastFailed,
    ObjectNotFound,
    MultipleMatches,

    // Preconditions
    UnmetPrecondition,

    // Execute
    Exception,
}

export default CommandError;
