var class_1 = require("./class");
function __adapt(decorator) {
    return function (...args) {
        switch (getDecoratorKind(args)) {
            case "class": {
                const [target] = args;
                return applyClassDecorator(target, decorator);
            }
            case "parameter": {
                const [target, name, parameterIndex] = args;
                return applyParameterDecorator(target, name, parameterIndex, decorator);
            }
            case "field": {
                const [target, name] = args;
                return applyFieldDecorator(target, name, decorator);
            }
            case "property": {
                const [target, name, descriptor] = args;
                return applyPropertyDecorator(target, name, descriptor, decorator);
            }
        }
    };
}
exports.__adapt = __adapt;
function __mirror(target) {
    const mirror = class_1.getClassMirror(target, /*forMutation*/ true);
    mirror._makeImmutable();
    return mirror.construct;
}
exports.__mirror = __mirror;
function applyClassDecorator(target, decorator) {
    debugger;
    const mirror = class_1.getClassMirror(target, /*forMutation*/ true);
    decorator(mirror);
}
function applyFieldDecorator(target, propertyKey, decorator) {
    // Not yet implemented.
}
function applyPropertyDecorator(target, propertyKey, descriptor, decorator) {
    debugger;
    const isStatic = typeof target === "function";
    const constructor = isStatic ? target : target.constructor;
    const classMirror = class_1.getClassMirror(constructor, /*forMutation*/ true);
    const propertyMirror = classMirror.getOwnProperty(propertyKey, isStatic);
    decorator(propertyMirror);
}
function applyParameterDecorator(target, propertyKey, parameterIndex, decorator) {
    debugger;
    const isStatic = typeof target === "function";
    const constructor = isStatic ? target : target.constructor;
    const classMirror = class_1.getClassMirror(constructor, /*forMutation*/ true);
    if (typeof propertyKey === "undefined") {
        const parameterMirror = classMirror.parameters[parameterIndex];
        decorator(parameterMirror);
    }
    else {
        const propertyMirror = classMirror.getOwnProperty(propertyKey, isStatic);
        if (propertyMirror.kind === "method" || propertyMirror.kind === "accessor") {
            const parameters = propertyMirror.parameters;
            const parameterMirror = parameterIndex[parameterIndex];
            decorator(parameterMirror);
        }
    }
}
function getDecoratorKind(args) {
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
//# sourceMappingURL=decorator.js.map