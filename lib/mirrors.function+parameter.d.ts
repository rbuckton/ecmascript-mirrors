/// <reference path="mirrors.function.d.ts" />
/// <reference path="mirrors.parameter.d.ts" />

/** A Mirror for a function declaration or function expression. */
interface FunctionMirror extends DeclarationMirror {
    /** Gets the declared parameters for the function. */
    readonly parameters: ReadonlyCollection<ParameterMirror>;
}