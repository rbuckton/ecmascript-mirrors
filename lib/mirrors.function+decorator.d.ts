/// <reference path="mirrors.function.d.ts" />
/// <reference path="mirrors.decorator.d.ts" />

/** Decorator for a function declaration, function expression, or arrow function. */
type FunctionDecoratorFunction = (mirror: FunctionMirror) => void;

