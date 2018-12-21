export default class ParameterInfo {
    public isOptional: boolean = false;

    constructor(
        public name: string,
        public type: any,
        public remainder: boolean  = false,
        public isMultiple: boolean = false,
        public defaultValue: any   = undefined,
    ) {
        this.isOptional = defaultValue === null;
    }
};
