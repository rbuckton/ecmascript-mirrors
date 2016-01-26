export abstract class Mirror {
    get kind(): string { throw new TypeError(); }
    get state(): string { throw new TypeError(); }
}