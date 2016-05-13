var mirror_1 = require("./mirror");
var parameter_1 = require("./parameter");
var property_1 = require("./property");
const classMirrors = new WeakMap();
const objectHasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(object, propertyKey, hint) {
    return objectHasOwnProperty.call(object, propertyKey)
        && (typeof hint !== "string" || typeof object[propertyKey] === hint);
}
class ClassMirror extends mirror_1.Mirror {
    constructor(constructor) {
        if (typeof constructor !== "function")
            throw new TypeError();
        super();
        this._initialized = false;
        this._originalConstructor = constructor;
        this._construct = constructor;
        this._parameters = parameter_1.getParameterMirrors(this, constructor);
        this._copyProperties(constructor.prototype, /*staticProperties*/ false);
        this._copyProperties(constructor, /*staticProperties*/ true);
    }
    get kind() { return "class"; }
    get name() { return this._originalConstructor.name; }
    get state() { return this._initialized ? "initialized" : "initializing"; }
    get parameters() { return this._parameters.slice(); }
    get construct() { return this._construct; }
    set construct(value) {
        if (typeof value !== "function")
            throw new TypeError();
        this._throwIfNotInitializing();
        this._construct = value;
    }
    defineProperty(propertyKey, descriptor, isStatic) {
        if (typeof descriptor !== "object" && descriptor !== null)
            throw new TypeError();
        this._throwIfNotInitializing();
        const key = typeof propertyKey === "symbol" ? propertyKey : String(propertyKey);
        if (this.hasOwnProperty(key, isStatic)) {
            const property = this.getOwnProperty(propertyKey, isStatic);
            if (property.kind !== property_1.getPropertyKind(descriptor)) {
                return this._defineProperty(propertyKey, descriptor, isStatic);
            }
            else {
                switch (property.kind) {
                    case "accessor":
                        if (hasOwn(descriptor, "get"))
                            property.get = descriptor.get;
                        if (hasOwn(descriptor, "set"))
                            property.set = descriptor.set;
                        break;
                    case "method":
                    case "data":
                        if (hasOwn(descriptor, "writable", "boolean"))
                            property.writable = descriptor.writable;
                        if (hasOwn(descriptor, "value"))
                            property.value = descriptor.value;
                        break;
                }
            }
            return property;
        }
        else {
            return this._defineProperty(key, descriptor, isStatic);
        }
    }
    deleteProperty(propertyKey, isStatic) {
        if (this._initialized) {
            return false;
        }
        const key = typeof propertyKey === "symbol" ? propertyKey : String(propertyKey);
        const properties = this._getProperties(isStatic, /*create*/ false);
        return properties ? properties.delete(key) : false;
    }
    hasOwnProperty(propertyKey, staticProperties) {
        const key = typeof propertyKey === "symbol" ? propertyKey : String(propertyKey);
        const properties = this._getProperties(staticProperties, /*create*/ false);
        return properties ? properties.has(key) : false;
    }
    getOwnProperty(propertyKey, staticProperties) {
        const key = typeof propertyKey === "symbol" ? propertyKey : String(propertyKey);
        const properties = this._getProperties(staticProperties, /*create*/ false);
        return properties ? properties.get(key) : undefined;
    }
    getOwnProperties(staticProperties) {
        const properties = this._getProperties(staticProperties, /*create*/ false);
        return properties ? [...properties.values()] : [];
    }
    /*@internal*/ _makeImmutable() {
        if (this._initialized) {
            return;
        }
        if (this._construct !== this._originalConstructor) {
            const constructor = this._construct;
            this._construct = new Proxy(this._originalConstructor, {
                construct(target, argArray, newTarget) {
                    return Reflect.construct(constructor, argArray, newTarget);
                },
                apply(target, thisArg, argArray) {
                    return Reflect.apply(constructor, thisArg, argArray);
                }
            });
        }
        const constructor = this._construct;
        const prototype = constructor.prototype;
        for (const property of this.getOwnProperties(/*staticProperties*/ false)) {
            property._defineProperty(prototype);
        }
        for (const property of this.getOwnProperties(/*staticProperties*/ true)) {
            property._defineProperty(constructor);
        }
        this._initialized = true;
    }
    _getProperties(staticProperties, create) {
        if (staticProperties) {
            if (this._staticProperties === undefined && create) {
                this._staticProperties = new Map();
            }
            return this._staticProperties;
        }
        else {
            if (this._prototypeProperties === undefined && create) {
                this._prototypeProperties = new Map();
            }
            return this._prototypeProperties;
        }
    }
    _copyProperties(object, staticProperties) {
        for (const key of Object.getOwnPropertyNames(object)) {
            if (!staticProperties && key === "constructor") {
                continue;
            }
            const descriptor = Object.getOwnPropertyDescriptor(object, key);
            this._defineProperty(key, descriptor, staticProperties);
        }
    }
    _defineProperty(propertyKey, descriptor, isStatic) {
        const property = this._createProperty(propertyKey, descriptor, isStatic);
        const properties = this._getProperties(isStatic, /*create*/ true);
        properties.set(propertyKey, property);
        return property;
    }
    _createProperty(propertyKey, descriptor, isStatic) {
        switch (property_1.getPropertyKind(descriptor)) {
            case "accessor":
                return new property_1.AccessorMirror(this, propertyKey, descriptor, isStatic);
            case "method":
                return new property_1.MethodMirror(this, propertyKey, descriptor, isStatic);
            case "data":
                return new property_1.DataPropertyMirror(this, propertyKey, descriptor, isStatic);
        }
    }
    _throwIfInitializing() {
        if (this.state === "initializing")
            throw new TypeError();
    }
    _throwIfNotInitializing() {
        if (this.state !== "initializing")
            throw new TypeError();
    }
}
exports.ClassMirror = ClassMirror;
function getClassMirror(reference, forMutation) {
    if (classMirrors.has(reference)) {
        const classMirror = classMirrors.get(reference);
        if (forMutation && classMirror.state !== "initializing") {
            throw new TypeError();
        }
        return classMirror;
    }
    else {
        const classMirror = new ClassMirror(reference);
        classMirrors.set(reference, classMirror);
        return classMirror;
    }
}
exports.getClassMirror = getClassMirror;
//# sourceMappingURL=class.js.map