import { Mirror } from "./mirror";
import { ParameterMirror, getParameterMirrors } from "./parameter";
import {
    PropertyMirror,
    AccessorDescriptor,
    AccessorMirror,
    MethodDescriptor,
    MethodMirror,
    DataPropertyDescriptor,
    DataPropertyMirror,
    getPropertyKind,
} from "./property";

const classMirrors = new WeakMap<Function, ClassMirror>();
const objectHasOwnProperty = Object.prototype.hasOwnProperty;

function hasOwn(object: any, propertyKey: PropertyKey, hint?: string): boolean {
    return objectHasOwnProperty.call(object, propertyKey)
        && (typeof hint !== "string" || typeof object[propertyKey] === hint);
}

export class ClassMirror extends Mirror {
    private _originalConstructor: Function;
    private _construct: Function;
    private _initialized: boolean;
    private _prototypeProperties: Map<PropertyKey, PropertyMirror>;
    private _staticProperties: Map<PropertyKey, PropertyMirror>;
    private _parameters: ParameterMirror[];

    constructor(constructor: Function) {
        if (typeof constructor !== "function") throw new TypeError();
        super();
        this._initialized = false;
        this._originalConstructor = constructor;
        this._construct = constructor;
        this._parameters = getParameterMirrors(this, constructor);
        this._copyProperties(constructor.prototype, /*staticProperties*/ false);
        this._copyProperties(constructor, /*staticProperties*/ true);
    }

    public get kind() { return "class"; }
    public get name() { return this._originalConstructor.name; }
    public get state() { return this._initialized ? "initialized" : "initializing" }
    public get parameters() { return this._parameters.slice(); }

    public get construct(): Function { return this._construct; }
    public set construct(value: Function) {
        if (typeof value !== "function") throw new TypeError();
        this._throwIfNotInitializing();
        this._construct = value;
    }

    public defineProperty(propertyKey: PropertyKey, descriptor: AccessorDescriptor, isStatic?: boolean): AccessorMirror;
    public defineProperty(propertyKey: PropertyKey, descriptor: MethodDescriptor, isStatic?: boolean): MethodMirror;
    public defineProperty(propertyKey: PropertyKey, descriptor: DataPropertyDescriptor, isStatic?: boolean): DataPropertyMirror;
    public defineProperty<T extends PropertyMirror>(propertyKey: PropertyKey, descriptor: PropertyDescriptor, isStatic?: boolean): T {
        if (typeof descriptor !== "object" && descriptor !== null) throw new TypeError();
        this._throwIfNotInitializing();
        const key = typeof propertyKey === "symbol" ? propertyKey : String(propertyKey);
        if (this.hasOwnProperty(key, isStatic)) {
            const property = this.getOwnProperty(propertyKey, isStatic);
            if (property.kind !== getPropertyKind(descriptor)) {
                return <T>this._defineProperty(propertyKey, descriptor, isStatic);
            }
            else {
                switch (property.kind) {
                    case "accessor":
                        if (hasOwn(descriptor, "get")) (<AccessorMirror>property).get = descriptor.get;
                        if (hasOwn(descriptor, "set")) (<AccessorMirror>property).set = descriptor.set;
                        break;
                    case "method":
                    case "data":
                        if (hasOwn(descriptor, "writable", "boolean")) (<MethodMirror | DataPropertyMirror>property).writable = descriptor.writable;
                        if (hasOwn(descriptor, "value")) (<MethodMirror | DataPropertyMirror>property).value = descriptor.value;
                        break;
                }
            }
            return <T>property;
        }
        else {
            return <T>this._defineProperty(key, descriptor, isStatic);
        }
    }

    public deleteProperty(propertyKey: PropertyKey, isStatic?: boolean): boolean {
        if (this._initialized) {
            return false;
        }

        const key = typeof propertyKey === "symbol" ? propertyKey : String(propertyKey);
        const properties = this._getProperties(isStatic, /*create*/ false);
        return properties ? properties.delete(key) : false;
    }

    public hasOwnProperty(propertyKey: PropertyKey, staticProperties?: boolean): boolean {
        const key = typeof propertyKey === "symbol" ? propertyKey : String(propertyKey);
        const properties = this._getProperties(staticProperties, /*create*/ false);
        return properties ? properties.has(key) : false;
    }

    public getOwnProperty(propertyKey: PropertyKey, staticProperties?: boolean): PropertyMirror {
        const key = typeof propertyKey === "symbol" ? propertyKey : String(propertyKey);
        const properties = this._getProperties(staticProperties, /*create*/ false);
        return properties ? properties.get(key) : undefined;
    }

    public getOwnProperties(staticProperties?: boolean): PropertyMirror[] {
        const properties = this._getProperties(staticProperties, /*create*/ false);
        return properties ? [...properties.values()] : [];
    }

    /*@internal*/ _makeImmutable(): void {
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

    private _getProperties(staticProperties: boolean, create: boolean): Map<PropertyKey, PropertyMirror> {
        if (staticProperties) {
            if (this._staticProperties === undefined && create) {
                this._staticProperties = new Map<PropertyKey, PropertyMirror>();
            }
            return this._staticProperties;
        }
        else {
            if (this._prototypeProperties === undefined && create) {
                this._prototypeProperties = new Map<PropertyKey, PropertyMirror>();
            }
            return this._prototypeProperties;
        }
    }

    private _copyProperties(object: any, staticProperties: boolean): void {
        for (const key of Object.getOwnPropertyNames(object)) {
            if (!staticProperties && key === "constructor") {
                continue;
            }

            const descriptor = Object.getOwnPropertyDescriptor(object, key);
            this._defineProperty(key, descriptor, staticProperties);
        }
    }

    private _defineProperty(propertyKey: PropertyKey, descriptor: PropertyDescriptor, isStatic: boolean): PropertyMirror {
        const property = this._createProperty(propertyKey, descriptor, isStatic);
        const properties = this._getProperties(isStatic, /*create*/ true);
        properties.set(propertyKey, property);
        return property;
    }

    private _createProperty(propertyKey: PropertyKey, descriptor: PropertyDescriptor, isStatic: boolean): PropertyMirror {
        switch (getPropertyKind(descriptor)) {
            case "accessor":
                return new AccessorMirror(this, propertyKey, <AccessorDescriptor>descriptor, isStatic);
            case "method":
                return new MethodMirror(this, propertyKey, <MethodDescriptor>descriptor, isStatic);
            case "data":
                return new DataPropertyMirror(this, propertyKey, <DataPropertyDescriptor>descriptor, isStatic);
        }
    }

    private _throwIfInitializing(): void {
        if (this.state === "initializing") throw new TypeError();
    }

    private _throwIfNotInitializing(): void {
        if (this.state !== "initializing") throw new TypeError();
    }
}

export function getClassMirror(reference: Function, forMutation: boolean): ClassMirror {
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
