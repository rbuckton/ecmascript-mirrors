/// <reference path="mirrors.d.ts" />

//
// Decorators
//
// These types indicate the expected call signature for a decorator function.

/** General-purpose decorator. */
type DecoratorFunction = (mirror: Mirror) => void;

/** Decorator for a class declaration or expression. */
type ClassDecoratorFunction = (mirror: ClassMirror) => void;

/** Decorator for a constructor declaration. */
type ConstructorDecoratorFunction = (mirror: ConstructorMirror) => void;

/** Decorator for a member declaration. */
type MemberDecoratorFunction = (mirror: MemberMirror) => void;

/** Decorator for a method declaration. */
type MethodDecoratorFunction = (mirror: MethodMirror) => void;

/** Decorator for a get accessor declaration. */
type GetterDecoratorFunction = (mirror: GetterMirror) => void;

/** Decorator for a set accessor declaration. */
type SetterDecoratorFunction = (mirror: SetterMirror) => void;

/** Decorator for a property assignment. */
type PropertyDecoratorFunction = (mirror: PropertyMirror) => void;