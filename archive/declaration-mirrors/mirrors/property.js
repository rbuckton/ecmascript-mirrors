var mirror_1 = require("./mirror");
var parameter_1 = require("./parameter");
class PropertyMirror extends mirror_1.Mirror {
    constructor(parent, name, descriptor, isStatic) {
        super();
        this._parent = parent;
        this._name = name;
        this._isStatic = isStatic;
        this._enumerable = descriptor.enumerable;
        this._configurable = descriptor.configurable;
    }
    get isStatic() { return this._isStatic; }
    get name() { return this._name; }
    get parent() { return this._parent; }
    get enumerable() { return this._enumerable || false; }
    set enumerable(value) {
        this._throwIfNotInitializing();
        this._enumerable = value;
    }
    get configurable() { return this._configurable || false; }
    set configurable(value) {
        this._throwIfInitializing();
        this._configurable = value;
    }
    _throwIfInitializing() {
        if (this._parent.state === "initializing")
            throw new TypeError();
    }
    _throwIfNotInitializing() {
        if (this._parent.state !== "initializing")
            throw new TypeError();
    }
    _fillDescriptor(descriptor) {
        descriptor.enumerable = this.enumerable;
        descriptor.configurable = this.configurable;
    }
    /*@internal*/ _defineProperty(target) {
        const descriptor = {};
        this._fillDescriptor(descriptor);
        Object.defineProperty(target, this._name, descriptor);
    }
}
exports.PropertyMirror = PropertyMirror;
class MethodMirror extends PropertyMirror {
    constructor(parent, name, descriptor, isStatic) {
        if (typeof descriptor.value !== "function")
            throw new TypeError();
        super(parent, name, descriptor, isStatic);
        this._writable = descriptor.writable;
        this._value = descriptor.value;
        this._parameters = parameter_1.getParameterMirrors(this, this._value);
    }
    get kind() { return "method"; }
    get parameters() { return this._parameters.slice(); }
    get writable() { return this._writable || false; }
    set writable(value) {
        this._throwIfNotInitializing();
        this._writable = value;
    }
    get value() { return this._value; }
    set value(value) {
        if (typeof value !== "function")
            throw new TypeError();
        this._throwIfNotInitializing();
        this._value = value;
    }
    _fillDescriptor(descriptor) {
        super._fillDescriptor(descriptor);
        descriptor.writable = this.writable;
        descriptor.value = this._value;
    }
}
exports.MethodMirror = MethodMirror;
class DataPropertyMirror extends PropertyMirror {
    constructor(parent, name, descriptor, isStatic) {
        super(parent, name, descriptor, isStatic);
        this._writable = descriptor.writable;
        this._value = descriptor.value;
    }
    get kind() { return "data"; }
    get writable() { return this._writable || false; }
    set writable(value) {
        this._throwIfNotInitializing();
        this._writable = value;
    }
    get value() { return this._value; }
    set value(value) {
        this._throwIfNotInitializing();
        this._value = value;
    }
    _fillDescriptor(descriptor) {
        super._fillDescriptor(descriptor);
        descriptor.writable = this.writable;
        descriptor.value = this._value;
    }
}
exports.DataPropertyMirror = DataPropertyMirror;
class AccessorMirror extends PropertyMirror {
    constructor(parent, name, descriptor, isStatic) {
        if (typeof descriptor.get !== "function" && typeof descriptor.set !== "function")
            throw new TypeError();
        if (typeof descriptor.get !== "function" && descriptor.get !== undefined && descriptor.get !== null)
            throw new TypeError();
        if (typeof descriptor.set !== "function" && descriptor.set !== undefined && descriptor.set !== null)
            throw new TypeError();
        super(parent, name, descriptor, isStatic);
        this._get = descriptor.get;
        this._set = descriptor.set;
        this._parameters = this._set ? parameter_1.getParameterMirrors(this, this._set) : [];
    }
    get kind() { return "accessor"; }
    get parameters() { return this._parameters.slice(); }
    get get() { return this._get; }
    set get(value) {
        if (typeof value !== "function" && value !== null && value !== undefined)
            throw new TypeError();
        this._throwIfNotInitializing();
        this._get = value;
    }
    get set() { return this._set; }
    set set(value) {
        if (typeof value !== "function" && value !== null && value !== undefined)
            throw new TypeError();
        this._throwIfNotInitializing();
        this._set = value;
    }
    _fillDescriptor(descriptor) {
        super._fillDescriptor(descriptor);
        descriptor.get = this._get;
        descriptor.set = this._set;
    }
}
exports.AccessorMirror = AccessorMirror;
function getPropertyKind(descriptor) {
    if (descriptor.get || descriptor.set) {
        return "accessor";
    }
    else if (typeof descriptor.value === "function") {
        return "method";
    }
    else {
        return "data";
    }
}
exports.getPropertyKind = getPropertyKind;
//# sourceMappingURL=property.js.map