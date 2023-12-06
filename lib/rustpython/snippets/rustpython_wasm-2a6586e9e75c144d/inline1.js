
export class PyError extends Error {
    constructor(info) {
        const msg = info.args[0];
        if (typeof msg === 'string') super(msg);
        else super();
        this.info = info;
    }
    get name() { return this.info.exc_type; }
    get traceback() { return this.info.traceback; }
    toString() { return this.info.rendered; }
}
