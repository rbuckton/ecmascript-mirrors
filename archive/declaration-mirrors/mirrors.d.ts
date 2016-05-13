import { AccessorDescriptor, MethodDescriptor, DataPropertyDescriptor } from "./mirrors/property";
export { AccessorDescriptor, MethodDescriptor, DataPropertyDescriptor } from "./mirrors/property";

export interface Mirror {
    kind: string;
    state: string;
}

export interface ClassMirror extends Mirror {
    name: string;
    parameters: ParameterMirror[];
    construct: Function;
    defineProperty(propertyKey: PropertyKey, descriptor: AccessorDescriptor, isStatic?: boolean): AccessorMirror;
    defineProperty(propertyKey: PropertyKey, descriptor: MethodDescriptor, isStatic?: boolean): MethodMirror;
    defineProperty(propertyKey: PropertyKey, descriptor: DataPropertyDescriptor, isStatic?: boolean): DataPropertyMirror;
    deleteProperty(propertyKey: PropertyKey, staticProperty?: boolean): boolean;
    hasOwnProperty(propertyKey: PropertyKey, staticProperty?: boolean): boolean;
    getOwnProperty(propertyKey: PropertyKey, staticProperty?: boolean): PropertyMirror;
    getOwnProperties(staticProperties?: boolean): PropertyMirror[];
}

export interface PropertyMirror extends Mirror {
    parent: ClassMirror;
    name: PropertyKey;
    isStatic: boolean;
    enumerable: boolean;
    configurable: boolean;
}

export interface MethodMirror extends PropertyMirror {
    writable: boolean;
    value: Function;
    parameters: ParameterMirror[];
}

export interface DataPropertyMirror extends PropertyMirror {
    writable: boolean;
    value: any;
}

export interface AccessorMirror extends PropertyMirror {
    get: () => any;
    set: (value: any) => void;
    parameters: ParameterMirror[];
}

export interface ParameterMirror extends Mirror {
    parent: Mirror;
    index: number;
}