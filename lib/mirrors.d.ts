//
// Mirrors API
//
// This is the core API for ECMAScript Mirrors.

declare namespace Reflect {
    /**
     * Gets a mirror for the target.
     *
     * @param target The target of the mirror.
     * @param usage The intended usage for the mirror, either a read-only introspection mirror or
     *      a writable mutation mirror. Default "mutation".
     * @returns null or undefined, respectively, if target is either null or undefined; otherwise,
     *      a mirror for the provided target.
     */
    function mirror(target: any, usage?: MirrorUsage): TopLevelMirror | undefined | null;
}

/** The available kinds of mirrors. */
type MirrorKind = ("class" | "constructor" | "method" | "accessor" | "get" | "set" | "property") | ExtendedMirrorKinds;

/** A hint as to the intended usage of a mirror. */
type MirrorUsage = ("mutation" | "introspection");

/** The available states of mirrors */
type MirrorState = ("declaration" | "mutation" | "introspection");

/** The types of mirrors that can be retrieved from a call to Reflect.mirror. */
type TopLevelMirror = ClassMirror | ExtendedTopLevelMirrorTypes;

/** A Mirror for a declaration or value. */
interface Mirror {
    /**
     * Gets the kind of mirror this represents.
     *
     * The kind indicates which specific mirror interface describes the shape of this mirror:
     *  "class"         - ClassMirror
     *  "constructor"   - ConstructorMirror
     *  "method"        - MethodMirror
     *  "accessor"      - AccessorMirror
     *  "get"           - GetterMirror
     *  "set"           - SetterMirror
     *  "property"      - PropertyMirror
     *
     * The following are extended kinds that are reserved for future proposals:
     *  "object"        - ObjectMirror
     *  "function"      - FunctionMirror
     *  "field"         - FieldMirror
     *  "parameter"     - ParameterMirror
     */
    readonly kind: MirrorKind;

    /**
     * Gets the state of the mirror.
     *
     * When a mirror is in the "declaration" state, the underlying target for the mirror does not
     * yet have a runtime value. Any method or property that directly interacts with the runtime
     * value will throw an error unless otherwise specified.
     *
     * When a mirror is in the "mutation" state, any method that would directly modify the
     * underlying declaration will throw an error unless otherwise specified.
     *
     * When a mirror is in the "introspection" state, any method or property that would directly
     * modify the runtime value or the underlying declaration will throw an error unless otherwise
     * specified.
     */
    readonly state: MirrorState;

    /**
     * Gets an introspection (read-only) mirror for this mirror.
     */
    forIntrospection(): Mirror;
}

/** A Mirror for a declaration. */
interface DeclarationMirror extends Mirror {
}

/** The types permitted for the name of a member. */
type MemberName = string | symbol | ExtendedMemberNames;

/** The kinds legal for a member of a class or object. */
type MemberKind = "method" | "accessor" | "property" | ExtendedMemberKinds;

/** The legal types for parents of a member. */
type MemberParentMirror = ClassMirror | ExtendedMemberParentMirrorTypes;

/** The known subtypes of MemberMirror */
type ClassMemberLikeMirror = MemberMirror | MethodMirror | AccessorMirror | PropertyMirror | ExtendedMemberLikeMirrors;

/** A Mirror for a class declaration or class expression. */
interface ClassMirror extends DeclarationMirror {
    /**
     * Gets the kind of mirror this represents. (Inherited from Mirror)
     *
     * For a ClassMirror this is always "class".
     */
    readonly kind: "class";

    /** Gets the state of the mirror. (Inherited from Mirror) */
    readonly state: MirrorState;

    /** The name of the class, if defined. */
    readonly name: string | undefined;

    /** Gets the constructor for the class. */
    readonly classConstructor: ConstructorMirror;

    /** Gets the mirror for the superclass. */
    readonly superClass: ClassMirror | null;

    /** Gets a value indicating whether the class is extensible. */
    readonly extensible: boolean;

    /**
     * Tests for the existance of a named member of a class.
     *
     * @param name The name of the member.
     * @param filter Options used to filter members.
     * @returns true if the member is defined; otherwise, false.
     */
    hasMember(name: MemberName, filter?: ClassMemberFilter): boolean;

    /**
     * Gets a named member of a class.
     *
     * @param name The name of the member.
     * @param filter Options used to filter members.
     * @returns A MemberMirror for the named member if it exists; otherwise, undefined.
     */
    getMember(name: MemberName, filter?: ClassMemberFilter): ClassMemberLikeMirror | undefined;

    /**
     * Gets the members of a class.
     *
     * @param filter Options used to filter members.
     * @returns An Iterable of members that match the provided filter.
     *
     * Members whose names are PrivateSlot objects will only be returned if the mirror's state is
     * "declaration".
     */
    getMembers(filter?: ClassMemberFilter): Iterable<ClassMemberLikeMirror>;

    /**
     * Deletes a named member member of a class.
     *
     * @param name The name of the member.
     * @param filter Options used to filter members.
     * @returns true if the member was successfully deleted; otherwise, false.
     */
    deleteMember(name: MemberName, filter?: ClassMemberDeleteFilter): boolean;

    /**
     * Defines a method on a class.
     *
     * @param name The name of the method.
     * @param descriptor The descriptor for the method.
     * @returns A MethodMirror for the method.
     * @throws This method will throw an error if the mirror's current state is "introspection".
     */
    defineMethod(name: MemberName, descriptor: MethodDescriptor): MethodMirror;

    /**
     * Defines an accessor on a class.
     *
     * @param name The name of the accessor.
     * @param descriptor The descriptor for the accessor.
     * @returns An AccessorMirror for the accessor.
     * @throws This method will throw an error if the mirror's current state is "introspection".
     */
    defineAccessor(name: MemberName, descriptor: AccessorDescriptor): AccessorMirror;

    /**
     * Defines a data property on a class.
     *
     * @param name The name of the property.
     * @param descriptor The descriptor for the property.
     * @returns A DataPropertyMirror for the property.
     * @throws This method will throw an error if the mirror's current state is "introspection".
     */
    defineProperty(name: MemberName, descriptor: DataDescriptor): PropertyMirror;

    /**
     * Prevents extensions to the class.
     *
     * @returns true if extensions could be prevented; otherwise, false.
     */
    preventExtensions(): boolean;

    /**
     * Creates an instance of the provided class.
     *
     * @param argumentsList The arguments to use for the function invocation.
     * @param newTarget An optional target to use as the "new.target" binding for the function
     *      invocation.
     * @returns The result of instantiating a new instance of the underlying class.
     * @throws This method will throw an error if the mirror's current state is "declaration".
     */
    construct(argumentsList: Iterable<any>, newTarget?: any): any;

    /**
     * Gets an introspection (read-only) mirror for this mirror. (Inherited from Mirror)
     */
    forIntrospection(): ClassMirror;
}

/** Options used to filter class members. */
interface ClassMemberFilter {
    /**
     * Indicates whether to include static or non-static members.
     *
     * If true, only static members will be included.
     * If false, only non-static (prototype and instance) members will be included.
     * If undefined, all members will be included.
     */
    static?: boolean;

    /**
     * Indicates whether to only include own members.
     *
     * If true, only own members will be included.
     * If false or undefined, own members will be unioned with members defined on each supertype.
     */
    own?: boolean,

    /**
     * Indicates the kind of members to include.
     *
     * If "method", only methods will be included.
     * If "accessor", only accessors will be included.
     * If "property", only data properties will be included.
     * If undefined, all members will be included.
     *
     * The following extended kind is reserved for future proposals:
     *
     * If "field", only fields will be included.
     */
    kind?: MemberKind;
}

/** Options used to filter class members. */
interface ClassMemberDeleteFilter {
    /**
     * Indicates whether to include static or non-static members.
     *
     * If true, only static members will be included.
     * If false, only non-static (prototype and instance) members will be included.
     * If undefined, all members will be included.
     */
    static?: boolean;

    /**
     * Indicates the kind of members to include.
     *
     * If "method", only methods will be included.
     * If "accessor", only accessors will be included.
     * If "property", only data properties will be included.
     * If undefined, all members will be included.
     *
     * The following extended kind is reserved for future proposals:
     *
     * If "field", only fields will be included.
     */
    kind?: MemberKind;
}

/** A Mirror for the constructor of a class. */
interface ConstructorMirror extends DeclarationMirror {
    /**
     * Gets the kind of mirror this represents. (Inherited from Mirror)
     * For a ConstructorMirror this is always "constructor".
     */
    readonly kind: "constructor";

    /** Gets the state of the mirror. (Inherited from Mirror) */
    readonly state: MirrorState;

    /** Gets the name of the class, if defined. */
    readonly name: string | undefined;

    /** Gets the parent ClassMirror for this member. */
    readonly parent: ClassMirror;

    /**
     * Gets or sets the underlying function for the constructor.
     *
     * @throws Setting this property will throw an error if the mirror's current state is not
     *      "declaration".
     * @throws Setting this property will throw an error if the value is not a function.
     */
    value: Function;

    /**
     * Creates an instance of the provided class.
     *
     * @param argumentsList The arguments to use for the function invocation.
     * @param newTarget An optional target to use as the "new.target" binding for the function
     *      invocation.
     * @returns The result of instantiating a new instance of the underlying class.
     * @throws This method will throw an error if the mirror's current state is "declaration".
     */
    construct(argumentsList: Iterable<any>, newTarget?: any): any;

    /**
     * Gets an introspection (read-only) mirror for this mirror. (Inherited from Mirror)
     */
    forIntrospection(): ConstructorMirror;
}

/** A Mirror for a member defined on a class. */
interface MemberMirror extends DeclarationMirror {
    /** Gets the kind of mirror this represents. (Inherited from Mirror) */
    readonly kind: MemberKind;

    /** Gets the state of the mirror. (Inherited from Mirror) */
    readonly state: MirrorState;

    /** Gets the name of the member. */
    readonly name: MemberName;

    /** Gets the parent ClassMirror for this member. */
    readonly parent: MemberParentMirror;

    /** Gets a value indicating whether the member is a static member of the class. */
    readonly static: boolean;

    /**
     * Gets or sets a value indicating whether the method is enumerable.
     *
     * @throws Setting this property will throw an error if the mirror's current state is not
     *      "declaration".
     */
    enumerable: boolean;

    /**
     * Gets or sets a value indicating whether the method is configurable.
     *
     * @throws Setting this property will throw an error if the mirror's current state is not
     *      "declaration".
     */
    configurable: boolean;

    /**
     * Gets the member this method shadows on its superclass, if one exists.
     */
    getShadowedMember(): MemberMirror | undefined;

    /**
     * Gets an introspection (read-only) mirror for this mirror. (Inherited from Mirror)
     */
    forIntrospection(): MemberMirror;
}

/** A Mirror for a method defined on a class or object. */
interface MethodMirror extends MemberMirror {
    /**
     * Gets the kind of mirror this represents. (Inherited from Mirror)
     *
     * For a MethodMirror this is always "method".
     */
    readonly kind: "method";

    /** Gets the state of the mirror. (Inherited from Mirror) */
    readonly state: MirrorState;

    /** Gets the name of the method. (Inherited from MemberMirror) */
    readonly name: MemberName;

    /** Gets the parent ClassMirror for this method. (Inherited from MemberMirror) */
    readonly parent: MemberParentMirror;

    /**
     * Gets a value indicating whether the method is a static member of the class. (Inherited
     * from MemberMirror)
     * */
    readonly static: boolean;

    /**
     * Gets or sets a value indicating whether the method is enumerable. (Inherited from
     * MemberMirror)
     *
     * @throws Setting this property will throw an error if the mirror's current state is not
     *      "declaration".
     */
    enumerable: boolean;

    /**
     * Gets or sets a value indicating whether the method is configurable. (Inherited from
     * MemberMirror)
     *
     * @throws Setting this property will throw an error if the mirror's current state is not
     *      "declaration".
     */
    configurable: boolean;

    /**
     * Gets or sets a value indicating whether the method is writable.
     *
     * @throws Setting this property will throw an error if the mirror's current state is not
     *      "declaration".
     */
    writable: boolean;

    /**
     * Gets or sets the underlying function for the method.
     *
     * @throws Setting this property will throw an error if the mirror's current state is not
     *      "declaration".
     * @throws Setting this property will throw an error if the value is not a function.
     */
    value: Function;

    /**
     * Gets the member this method shadows on its superclass, if one exists. (Inherited from
     * MemberMirror)
     */
    getShadowedMember(): MemberMirror | undefined;

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
     * Gets an introspection (read-only) mirror for this mirror. (Inherited from Mirror)
     */
    forIntrospection(): MethodMirror;
}

/** A Mirror for a property defined on a class or object. */
interface PropertyMirror extends MemberMirror {
    /**
     * Gets the kind of mirror this represents. (Inherited from Mirror)
     *
     * For a PropertyMirror this is always "property".
     */
    readonly kind: "property";

    /** Gets the state of the mirror. (Inherited from Mirror) */
    readonly state: MirrorState;

    /** Gets the name of the property. (Inherited from MemberMirror) */
    readonly name: MemberName;

    /** Gets the parent ClassMirror for this property. (Inherited from MemberMirror) */
    readonly parent: MemberParentMirror;

    /**
     * Gets a value indicating whether the property is a static member of the class. (Inherited
     * from MemberMirror)
     */
    readonly static: boolean;

    /**
     * Gets or sets a value indicating whether the property is enumerable. (Inherited from
     * MemberMirror)
     *
     * @throws Setting this property will throw an error if the mirror's current state is not
     *      "declaration".
     */
    enumerable: boolean;

    /**
     * Gets or sets a value indicating whether the property is configurable. (Inherited from
     * MemberMirror)
     *
     * @throws Setting this property will throw an error if the mirror's current state is not
     *      "declaration".
     */
    configurable: boolean;

    /**
     * Gets or sets a value indicating whether the property is writable.
     *
     * @throws Setting this property will throw an error if the mirror's current state is not
     *      "declaration".
     */
    writable: boolean;

    /**
     * Gets or sets the underlying value for the property.
     *
     * @throws Setting this property will throw an error if the mirror's current state is not
     *      "declaration".
     */
    value: any;

    /**
     * Gets the member this property shadows on its superclass, if one exists. (Inherited from
     * MemberMirror)
     */
    getShadowedMember(): MemberMirror | undefined;

    /**
     * Gets an introspection (read-only) mirror for this mirror. (Inherited from Mirror)
     */
    forIntrospection(): PropertyMirror;
}

/** A Mirror for an accessor defined on a class. */
interface AccessorMirror extends MemberMirror {
    /**
     * Gets the kind of mirror this represents. (Inherited from Mirror)
     *
     * For an AccessorMirror this is always "accessor".
     */
    readonly kind: "accessor";

    /** Gets the state of the mirror. (Inherited from Mirror) */
    readonly state: MirrorState;

    /** Gets the name of the method. (Inherited from MemberMirror) */
    readonly name: MemberName;

    /** Gets the parent ClassMirror for this method. (Inherited from MemberMirror) */
    readonly parent: MemberParentMirror;

    /**
     * Gets a value indicating whether the method is a static member of the class. (Inherited
     * from MemberMirror)
     */
    readonly static: boolean;

    /** Gets a value indicating whether the accessor has a get method. */
    readonly readable: boolean;

    /** Gets a value indicating whether the accessor has a set method. */
    readonly writable: boolean;

    /** Gets the mirror for the accessor's getter, if defined. */
    readonly get: GetterMirror | undefined;

    /** Gets the mirror for the accessor's setter, if defined. */
    readonly set: SetterMirror | undefined;

    /**
     * Gets or sets a value indicating whether the accessor is enumerable. (Inherited from
     * MemberMirror)
     *
     * @throws Setting this property will throw an error if the mirror's current state is not
     *      "declaration".
     */
    enumerable: boolean;

    /**
     * Gets or sets a value indicating whether the accessor is configurable. (Inherited from
     * MemberMirror)
     *
     * @throws Setting this property will throw an error if the mirror's current state is not
     *      "declaration".
     */
    configurable: boolean;

    /**
     * Gets the member this accessor shadows on its superclass, if one exists. (Inherited from
     * MemberMirror)
     */
    getShadowedMember(): MemberMirror | undefined;

    /**
     * Invokes the getter using the supplied target.
     *
     * @param target The value to use as the this argument for the function invocation.
     * @returns The result of invoking the getter.
     * @throws This method will throw an error if the mirror's current state is "declaration".
     * @throws This method will throw an error if the mirror does not have a get method.
     */
    getValue(target: any): any;

    /**
     * Invokes the setter using the supplied target and value.
     *
     * @param target The value to use as the this argument for the function invocation.
     * @param value The value to pass to the setter.
     * @returns true if the value could be set; otherwise, false.
     * @throws This method will throw an error if the mirror's current state is "declaration".
     */
    setValue(target: any, value: any): boolean;

    /**
     * Gets an introspection (read-only) mirror for this mirror. (Inherited from Mirror)
     */
    forIntrospection(): AccessorMirror;
}

/** A Mirror for a getter defined on a class. */
interface GetterMirror extends DeclarationMirror {
    /**
     * Gets the kind of mirror this represents. (Inherited from Mirror)
     *
     * For a GetterMirror this is always "get".
     */
    readonly kind: "get";

    /** Gets the state of the mirror. (Inherited from Mirror) */
    readonly state: MirrorState;

    /** Gets the name of the accessor. */
    readonly name: MemberName;

    /** Gets the parent AccessorMirror for this get method. */
    readonly parent: AccessorMirror;

    /** Gets a value indicating whether the get method is a static member of the class. */
    readonly static: boolean;

    /**
     * Gets or sets the underlying function for the get method.
     *
     * @throws Setting this property will throw an error if the mirror's current state is not
     *      "declaration".
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
     * Gets an introspection (read-only) mirror for this mirror. (Inherited from Mirror)
     */
    forIntrospection(): GetterMirror;
}

/** A Mirror for a setter defined on a class. */
interface SetterMirror extends DeclarationMirror {
    /**
     * Gets the kind of mirror this represents. (Inherited from Mirror)
     *
     * For a SetterMirror this is always "set".
     */
    readonly kind: "set";

    /** Gets the state of the mirror. (Inherited from Mirror) */
    readonly state: MirrorState;

    /** Gets the name of the accessor. */
    readonly name: MemberName;

    /** Gets the parent AccessorMirror for this set method. */
    readonly parent: AccessorMirror;

    /** Gets a value indicating whether the set method is a static member of the class. */
    readonly static: boolean;

    /**
     * Gets or sets the underlying function for the set method.
     *
     * @throws Setting this property will throw an error if the mirror's current state is not
     *      "declaration".
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
     * Gets an introspection (read-only) mirror for this mirror. (Inherited from Mirror)
     */
    forIntrospection(): SetterMirror;
}

//
// Descriptors
//
// These types describe the valid options for defining members.
// NOTE: Inherited members are duplicated on subtypes for easier reference.

/** A descriptor used to define a member on a class or object. */
interface MemberDescriptor {
    /** A value indicating whether the member is a static member of the class. Default false. */
    static?: boolean;

    /** A value indicating whether the member is enumerable. Default false. */
    enumerable?: boolean;

    /** A value indicating whether the member is configurable. Default false. */
    configurable?: boolean;
}

/** A descriptor used to define a method on a class or object. */
interface MethodDescriptor extends MemberDescriptor {
    /**
     * A value indicating whether the method is a static member of the class. Default false.
     * (Inherited from MemberDescriptor)
     */
    static?: boolean;

    /**
     * A value indicating whether the method is enumerable. Default false. (Inherited from
     * MemberDescriptor)
     */
    enumerable?: boolean;

    /**
     * A value indicating whether the method is configurable. Default false. (Inherited from
     * MemberDescriptor)
     */
    configurable?: boolean;

    /** A value indicating whether the method is writable. Default false. */
    writable?: boolean;

    /** The underlying function for the method. */
    value: Function;
}

/** A descriptor used to define a get or set accessor on a class or object. */
interface AccessorDescriptor extends MemberDescriptor {
    /**
     * A value indicating whether the accessor is a static member of the class. Default false.
     * (Inherited from MemberDescriptor)
     */
    static?: boolean;

    /**
     * A value indicating whether the accessor is enumerable. Default false. (Inherited from
     * MemberDescriptor)
     */
    enumerable?: boolean;

    /**
     * A value indicating whether the accessor is configurable. Default false. (Inherited from
     * MemberDescriptor)
     */
    configurable?: boolean;

    /** The underlying function for the getter. */
    get?(): any;

    /** The underlying function for the setter. */
    set?(value: any): void;
}

/** A descriptor used to define a data property on a class or object. */
interface DataDescriptor extends MemberDescriptor {
    /**
     * A value indicating whether the property is a static member of the class. Default false.
     * (Inherited from MemberDescriptor)
     */
    static?: boolean;

    /**
     * A value indicating whether the data property is enumerable. Default false. (Inherited from
     * MemberDescriptor)
     */
    enumerable?: boolean;

    /**
     * A value indicating whether the data property is configurable. Default false. (Inherited
     * from MemberDescriptor)
     */
    configurable?: boolean;

    /** A value indicating whether the data property is writable. Default false. */
    writable?: boolean;

    /** The underlying value for the data property. */
    value: any;
}

//
// Extensions
//
// Forward declarations for future extensions to the core proposal.

/** Extended mirror kinds reserved for future proposals. */
type ExtendedMirrorKinds = ("object" | "function" | "field" | "parameter");

/** Extended top-level mirror types reserved for future proposals. */
type ExtendedTopLevelMirrorTypes = ObjectMirror | FunctionMirror;

/** Extended member parent mirror types for future proposals */
type ExtendedMemberParentMirrorTypes = ObjectMirror;

interface ObjectMirror extends Mirror { }
interface FunctionMirror extends Mirror { }

/** Extended member names reserved for future proposals. */
type ExtendedMemberNames = PrivateSlot;

interface PrivateSlot { }

/** Extended member mirror kinds reserved for future proposals. */
type ExtendedMemberKinds = "field";

/** Extended known subtypes of MemberMirror for future proposals */
type ExtendedMemberLikeMirrors = FieldMirror;

interface FieldMirror extends MemberMirror { }
