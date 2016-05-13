import { getClassMirror } from "./class";
import { Mirror, ClassMirror, PropertyMirror, MethodMirror, AccessorMirror, ParameterMirror } from "../mirrors";

export function __adapt(decorator: (mirror: ClassMirror) => void): (target: Function) => void;
export function __adapt(decorator: (mirror: PropertyMirror) => void): (target: any, propertyKey: PropertyKey, descriptor: PropertyDescriptor) => void;
export function __adapt(decorator: (mirror: ParameterMirror) => void): (target: any, propertyKey: PropertyKey, parameterIndex: number) => void;
export function __adapt(decorator: (mirror: Mirror) => void): (target: any, propertyKey?: PropertyKey, descriptorOrIndex?: PropertyDescriptor | number) => any;
export function __adapt(decorator?: (mirror: Mirror) => void) {
    return function (...args: any[]) {
        switch (getDecoratorKind(args)) {
            case "class": {
                const [target] = <[Function]>args;
                return applyClassDecorator(target, decorator);
            }
            case "parameter": {
                const [target, name, parameterIndex] = <[any, PropertyKey, number]>args;
                return applyParameterDecorator(target, name, parameterIndex, decorator);
            }
            case "field": {
                const [target, name] = <[any, PropertyKey]>args;
                return applyFieldDecorator(target, name, decorator);
            }
            case "property": {
                const [target, name, descriptor] = <[any, PropertyKey, PropertyDescriptor]>args;
                return applyPropertyDecorator(target, name, descriptor, decorator);
            }
        }
    };
}

export function __mirror<T extends Function>(target: T): T {
    const mirror = getClassMirror(target, /*forMutation*/ true);
    mirror._makeImmutable();
    return <T>mirror.construct;
}

function applyClassDecorator(target: Function, decorator: (mirror: Mirror) => void) {
    debugger;

    const mirror = getClassMirror(target, /*forMutation*/ true);
    decorator(mirror);
}

function applyFieldDecorator(target: any, propertyKey: PropertyKey, decorator: (mirror: Mirror) => void) {
    // Not yet implemented.
}

function applyPropertyDecorator(target: any, propertyKey: PropertyKey, descriptor: PropertyDescriptor, decorator: (mirror: Mirror) => void) {
    debugger;

    const isStatic = typeof target === "function";
    const constructor: Function = isStatic ? target : target.constructor;
    const classMirror = getClassMirror(constructor, /*forMutation*/ true);
    const propertyMirror = classMirror.getOwnProperty(propertyKey, isStatic);
    decorator(propertyMirror);
}

function applyParameterDecorator(target: any, propertyKey: PropertyKey, parameterIndex: number, decorator: (mirror: Mirror) => void) {
    debugger;

    const isStatic = typeof target === "function";
    const constructor: Function = isStatic ? target : target.constructor;
    const classMirror = getClassMirror(constructor, /*forMutation*/ true);
    if (typeof propertyKey === "undefined") {
        const parameterMirror = classMirror.parameters[parameterIndex];
        decorator(parameterMirror);
    }
    else {
        const propertyMirror = classMirror.getOwnProperty(propertyKey, isStatic);
        if (propertyMirror.kind === "method" || propertyMirror.kind === "accessor") {
            const parameters = (<MethodMirror | AccessorMirror><any>propertyMirror).parameters;
            const parameterMirror = parameterIndex[parameterIndex];
            decorator(parameterMirror);
        }
    }
}

function getDecoratorKind(args: any[]) {
    if (args.length === 1 && typeof args[0] === "function") {
        return "class";
    }
    else if (args.length >= 2 && typeof args[2] === "number") {
        return "parameter";
    }
    else if (args.length >= 2 && typeof args[2] === "undefined") {
        return "field";
    }
    else {
        return "property";
    }
}