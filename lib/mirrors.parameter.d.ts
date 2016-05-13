/// <reference path="mirrors.d.ts" />

/** A Mirror for a parameter. */
interface ParameterMirror extends DeclarationMirror {
    /** Gets the kind of mirror this represents. For a ParameterMirror this is always "parameter". (Inherited from Mirror) */
    readonly kind: "parameter";

    /** Gets the state of the mirror. (Inherited from Mirror) */
    readonly state: MirrorState;

    /** Gets the parent mirror for this parameter. */
    readonly parent: FunctionLikeMirror;

    /** Gets the name of the parameter, if defined. */
    readonly name: string | undefined;

    /** Gets the index of this parameter. */
    readonly index: number;

    /**
     * Gets an introspection (read-only) mirror for this mirror. (Inherited from Mirror)
     */
    forIntrospection(): ParameterMirror;
}

/** A read-only collection (effectively a frozen array). */
interface ReadonlyCollection<T> extends ReadonlyArray<T>, Iterable<T> {
}

/** Known function-like mirrors. */
type FunctionLikeMirror = ConstructorMirror | MethodMirror | GetterMirror | SetterMirror | ExtendedFunctionLikeMirrors;

/** A Mirror for the constructor of a class. */
interface ConstructorMirror extends DeclarationMirror {
    /** Gets the parameters for the constructor. */
    readonly parameters: ReadonlyCollection<ParameterMirror>;
}

/** A Mirror for a method defined on a class or object. */
interface MethodMirror extends MemberMirror {
    /** Gets a read-only array for the declared parameters of the method. */
    readonly parameters: ReadonlyCollection<ParameterMirror>;
}

/** A Mirror for a getter defined on a class. */
interface GetterMirror extends DeclarationMirror {
    /** Gets a read-only array for the declared parameters of the get method. */
    readonly parameters: ReadonlyCollection<ParameterMirror>;
}

/** A Mirror for a setter defined on a class. */
interface SetterMirror extends DeclarationMirror {
    /** Gets a read-only array for the declared parameters of the set method. */
    readonly parameters: ReadonlyCollection<ParameterMirror>;
}

//
// Extensions
//
// Forward declarations for future extensions to this proposal.

/** Extended function-like mirror types reserved for future proposals. */
type ExtendedFunctionLikeMirrors = FunctionMirror;
