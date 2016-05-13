import { Mirror } from "./mirror";
import { ClassMirror } from "./class";
import { ParameterMirror, getParameterMirrors } from "./parameter";

export abstract class PropertyMirror extends Mirror {
    private _parent: ClassMirror;
    private _name: PropertyKey;
    private _isStatic: boolean;
    private _enumerable: boolean;
    private _configurable: boolean;

    constructor(parent: ClassMirror, name: PropertyKey, descriptor: PropertyDescriptor, isStatic: boolean) {
        super();
        this._parent = parent;
        this._name = name;
        this._isStatic = isStatic;
        this._enumerable = descriptor.enumerable;
        this._configurable = descriptor.configurable;
    }

    public get isStatic(): boolean { return this._isStatic; }

    public get name(): PropertyKey { return this._name; }

    public get parent(): ClassMirror { return this._parent; }

    public get enumerable(): boolean { return this._enumerable || false; }
    public set enumerable(value: boolean) {
        this._throwIfNotInitializing();
        this._enumerable = value;
    }

    public get configurable(): boolean { return this._configurable || false; }
    public set configurable(value: boolean) {
        this._throwIfInitializing();
        this._configurable = value;
    }

    protected _throwIfInitializing(): void {
        if (this._parent.state === "initializing") throw new TypeError();
    }

    protected _throwIfNotInitializing(): void {
        if (this._parent.state !== "initializing") throw new TypeError();
    }

    protected _fillDescriptor(descriptor: PropertyDescriptor) {
        descriptor.enumerable = this.enumerable;
        descriptor.configurable = this.configurable;
    }

    /*@internal*/ _defineProperty(target: any): void {
        const descriptor: PropertyDescriptor = {};
        this._fillDescriptor(descriptor);
        Object.defineProperty(target, this._name, descriptor);
    }
}

export interface MethodDescriptor {
    enumerable?: boolean;
    configurable?: boolean;
    writable?: boolean;
    value: Function;
}

export class MethodMirror extends PropertyMirror {
    private _writable: boolean;
    private _value: Function;
    private _originalValue: Function;
    private _parameters: ParameterMirror[];

    constructor(parent: ClassMirror, name: PropertyKey, descriptor: MethodDescriptor, isStatic: boolean) {
        if (typeof descriptor.value !== "function") throw new TypeError();
        super(parent, name, descriptor, isStatic);
        this._writable = descriptor.writable;
        this._value = descriptor.value;
        this._parameters = getParameterMirrors(this, this._value);
    }

    public get kind() { return "method"; }
    public get parameters() { return this._parameters.slice(); }

    public get writable() { return this._writable || false; }
    public set writable(value: boolean) {
        this._throwIfNotInitializing();
        this._writable = value;
    }

    public get value() { return this._value; }
    public set value(value: Function) {
        if (typeof value !== "function") throw new TypeError();
        this._throwIfNotInitializing();
        this._value = value;
    }

    protected _fillDescriptor(descriptor: PropertyDescriptor) {
        super._fillDescriptor(descriptor);
        descriptor.writable = this.writable;
        descriptor.value = this._value;
    }
}

export interface DataPropertyDescriptor {
    enumerable?: boolean;
    configurable?: boolean;
    writable?: boolean;
    value: any;
}

export class DataPropertyMirror extends PropertyMirror {
    private _writable: boolean;
    private _value: any;

    constructor(parent: ClassMirror, name: PropertyKey, descriptor: DataPropertyDescriptor, isStatic: boolean) {
        super(parent, name, descriptor, isStatic);
        this._writable = descriptor.writable;
        this._value = descriptor.value;
    }

    public get kind() { return "data"; }

    public get writable() { return this._writable || false; }
    public set writable(value: boolean) {
        this._throwIfNotInitializing();
        this._writable = value;
    }

    public get value() { return this._value; }
    public set value(value: any) {
        this._throwIfNotInitializing();
        this._value = value;
    }

    protected _fillDescriptor(descriptor: PropertyDescriptor) {
        super._fillDescriptor(descriptor);
        descriptor.writable = this.writable;
        descriptor.value = this._value;
    }
}

export interface AccessorDescriptor {
    enumerable?: boolean;
    configurable?: boolean;
    get?: () => any;
    set?: (value: any) => void;
}

export class AccessorMirror extends PropertyMirror {
    private _get: () => any;
    private _set: (value: any) => void;
    private _parameters: ParameterMirror[];

    constructor(parent: ClassMirror, name: PropertyKey, descriptor: AccessorDescriptor, isStatic: boolean) {
        if (typeof descriptor.get !== "function" && typeof descriptor.set !== "function") throw new TypeError();
        if (typeof descriptor.get !== "function" && descriptor.get !== undefined && descriptor.get !== null) throw new TypeError();
        if (typeof descriptor.set !== "function" && descriptor.set !== undefined && descriptor.set !== null) throw new TypeError();
        super(parent, name, descriptor, isStatic);
        this._get = descriptor.get;
        this._set = descriptor.set;
        this._parameters = this._set ? getParameterMirrors(this, this._set) : [];
    }

    public get kind() { return "accessor"; }
    public get parameters() { return this._parameters.slice(); }

    public get get() { return this._get; }
    public set get(value: () => any) {
        if (typeof value !== "function" && value !== null && value !== undefined) throw new TypeError();
        this._throwIfNotInitializing();
        this._get = value;
    }

    public get set() { return this._set; }
    public set set(value: (value: any) => void) {
        if (typeof value !== "function" && value !== null && value !== undefined) throw new TypeError();
        this._throwIfNotInitializing();
        this._set = value;
    }

    protected _fillDescriptor(descriptor: PropertyDescriptor) {
        super._fillDescriptor(descriptor);
        descriptor.get = this._get;
        descriptor.set = this._set;
    }
}

export function getPropertyKind(descriptor: PropertyDescriptor) {
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