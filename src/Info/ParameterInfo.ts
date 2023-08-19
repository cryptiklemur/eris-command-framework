export default class ParameterInfo {
    public isOptional: boolean = false;

    constructor(
        public name: string,
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        public type: any,
        public remainder: boolean  = false,
        public isMultiple: boolean = false,
        public defaultValue: any   = undefined,
    ) {
        this.isOptional = defaultValue === null;
    }
};
