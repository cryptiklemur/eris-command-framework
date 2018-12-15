export default class ParameterInfo {
    public IsOptional: boolean = false;

    constructor(
        public Name: string,
        public Type: any,
        public Remainder: boolean  = false,
        public IsMultiple: boolean = false,
        public DefaultValue: any   = undefined,
    ) {
        this.IsOptional = DefaultValue === null;
    }
};
