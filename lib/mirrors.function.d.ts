/// <reference path="mirrors.d.ts" />

/** A Mirror for a function declaration or function expression. */
interface FunctionMirror extends DeclarationMirror {
    /**
     * Gets the kind of mirror this represents. (Inherited from Mirror)
     *
     * For a FunctionMirror this is always "function".
     */
    readonly kind: "function";

    /** Gets the state of the mirror. (Inherited from Mirror) */
    readonly state: MirrorState;

    /** Gets the name of the function, if defined. */
    readonly name: string | undefined;

    /**
     * Gets or sets the underlying function for the function mirror.
     *
     * @throws Setting this property will throw an error if the mirror state is not "declaration".
     * @throws Setting this property will throw an error if the value is not a function.
     */
    value: Function;

    /**
     * Invokes the underlying function with the supplied "this" argument and argument list.
     *
     * @param thisArgument The value to use as the "this" argument for the function invocation.
     * @param argumentsList The arguments to use for the function invocation.
     * @returns The result of invoking the function.
     * @throws This method will throw an error if the mirror's current state is "declaration".
     */
    apply(thisArgument: any, argumentsList: Iterable<any>): any;

    /**
     * Constructs a new object using the underlying function as a constructor.
     *
     * @param argumentsList The arguments to use for the function invocation.
     * @param newTarget An optional target to use as the "new.target" binding for the function
     *      invocation.
     * @returns The result of invoking the underlying function as a constructor.
     * @throws This method will throw an error if the mirror's current state is "declaration".
     */
    construct(argumentsList: Iterable<any>, newTarget?: any): any;

    /**
     * Gets an introspection (read-only) mirror for this mirror. (Inherited from Mirror)
     */
    forIntrospection(): FunctionMirror;
}