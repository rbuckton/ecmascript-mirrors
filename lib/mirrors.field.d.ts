/// <reference path="mirrors.d.ts" />

/** A Mirror for a field on a class. */
interface FieldMirror extends MemberMirror {
    /** Gets the kind of mirror this represents. For a FieldMirror this is always "field". (Inherited from Mirror) */
    readonly kind: "field";

    /** Gets the state of the mirror. (Inherited from Mirror) */
    readonly state: MirrorState;

    /** Gets the name of the field. (Inherited from MemberMirror) */
    readonly name: MemberName;

    /** Gets the parent class for this field. (Inherited from MemberMirror) */
    readonly parent: ClassMirror;

    /** Gets a value indicating whether the field is a static member of the class. (Inherited from MemberMirror) */
    readonly static: boolean;

    /**
     * Gets or sets a value indicating whether the field is enumerable after initialization. (Inherited from MemberMirror)
     *
     * @throws Setting this property will throw an error if the mirror's current state is not "declaration".
     */
    enumerable: boolean;

    /**
     * Gets or sets a value indicating whether the field is configurable after initialization. (Inherited from MemberMirror)
     *
     * @throws Setting this property will throw an error if the mirror's current state is not "declaration".
     */
    configurable: boolean;

    /**
     * Gets or sets a value indicating whether the field is writable after initialization.
     *
     * @throws Setting this property will throw an error if the mirror's current state is not "declaration".
     */
    writable: boolean;

    /**
     * Gets or sets an initializer to evaluate when the field is initialized.
     *
     * @throws Setting this property will throw an error if the mirror's current state is not "declaration".
     */
    initializer: Function | undefined;

    /**
     * Gets the member this field shadows on its superclass, if one exists. (Inherited from MemberMirror)
     */
    getShadowedMember(): MemberMirror | undefined;

    /**
     * Gets an introspection (read-only) mirror for this mirror. (Inherited from Mirror)
     */
    forIntrospection(): FieldMirror;
}

/** A descriptor used to define a field on a class. */
interface FieldDescriptor extends MemberDescriptor {
    /** A value indicating whether the property is a static member of the class. Default false. (Inherited from MemberDescriptor) */
    static?: boolean;

    /** A value indicating whether the field is enumerable after initialization. Default false. (Inherited from MemberDescriptor) */
    enumerable?: boolean;

    /** A value indicating whether the field is configurable after initialization. Default false. (Inherited from MemberDescriptor) */
    configurable?: boolean;

    /** A value indicating whether the field is writable after initialization. Default false. */
    writable?: boolean;

    /** An optional function used to set the initial value of the field. */
    initializer?: Function;
}
