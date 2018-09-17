export class Tuple<T> {
    public v1: T;
    public v2: T;

    constructor(val1: T, val2: T) {
        this.v1 = val1;
        this.v2 = val2;
    }
}

export default Tuple;