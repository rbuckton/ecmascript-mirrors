/// <reference path="mirrors.d.ts" />

/** A Mirror for an object literal or value. */
interface ObjectMirror extends Mirror {
    /** Gets the kind of mirror this represents. For an ObjectMirror this is always "object". (Inherited from Mirror) */
    readonly kind: "object";

    /** Gets the state of the mirror. (Inherited from Mirror) */
    readonly state: MirrorState;

    /** Gets a mirror for the class from which this object was instantiated, if available. */
    readonly classMirror: ClassMirror | undefined;

    /** Gets a value indicating whether the class is extensible. */
    readonly extensible: boolean;

    /**
     * Gets the value for this mirror.
     *
     * @throws Accessing this property will throw an error if the mirror's state is "declaration".
     */
    readonly value: any;

    /**
     * Tests for the existance of a named member of an object.
     *
     * @param name The name of the member.
     * @param filter Options used to filter members.
     * @returns true if the member is defined; otherwise, false.
     */
    hasMember(name: MemberName, filter?: ObjectMemberFilter): boolean;

    /**
     * Gets a named member of an object.
     *
     * @param name The name of the member.
     * @param filter Options used to filter members.
     * @returns A MemberMirror for the named member if it exists; otherwise, undefined.
     */
    getMember(name: MemberName, filter?: ObjectMemberFilter): ObjectMemberLikeMirror | undefined;

    /**
     * Gets the members of an object.
     *
     * Members whose names are PrivateSlot objects will only be returned if the mirror's state is "declaration".
     *
     * @param filter Options used to filter members.
     * @returns An Iterable of members that match the provided filter.
     */
    getMembers(filter?: ObjectMemberFilter): Iterable<ObjectMemberLikeMirror>;

    /**
     * Deletes a named member member of an object.
     *
     * @param name The name of the member.
     * @param filter Options used to filter members.
     * @returns true if the member was successfully deleted; otherwise, false.
     */
    deleteMember(name: MemberName, filter?: ObjectMemberDeleteFilter): boolean;

    /**
     * Defines a method on an object.
     *
     * @param name The name of the method.
     * @param descriptor The descriptor for the method.
     * @returns A MethodMirror for the method.
     * @throws This method will throw an error if the mirror's state is "introspection".
     */
    defineMethod(name: MemberName, descriptor: MethodDescriptor): MethodMirror;

    /**
     * Defines an accessor on an object.
     *
     * @param name The name of the accessor.
     * @param descriptor The descriptor for the accessor.
     * @returns An AccessorMirror for the accessor.
     * @throws This method will throw an error if the mirror's state is "introspection".
     */
    defineAccessor(name: MemberName, descriptor: AccessorDescriptor): AccessorMirror;

    /**
     * Defines a data property on an object.
     *
     * @param name The name of the property.
     * @param descriptor The descriptor for the property.
     * @returns A PropertyMirror for the property.
     * @throws This method will throw an error if the mirror's state is "introspection".
     */
    defineProperty(name: MemberName, descriptor: DataDescriptor): PropertyMirror;

    /**
     * Gets the prototype for the object.
     *
     * @throws This method will throw an error if the mirror's state is "introspection".
     */
    getPrototype(): any;

    /**
     * Sets the prototype for the object.
     */
    setPrototype(proto: any): boolean;

    /**
     * Gets the value of the named property.
     *
     * @param name The name of the property.
     * @throws This method will throw an error if the mirror's state is "declaration".
     */
    get(name: MemberName): any;

    /**
     * Sets the value of the named property.
     *
     * @param name The name of the property.
     * @param value The value for the property.
     * @returns true if the property was set successfully; otherwise, false.
     */
    set(name: MemberName, value: any): boolean;

    /**
     * Prevents extensions to the class.
     *
     * @returns true if extensions could be prevented; otherwise, false.
     */
    preventExtensions(): boolean;

    /**
     * Gets an introspection (read-only) mirror for this mirror. (Inherited from Mirror)
     */
    forIntrospection(): ObjectMirror;
}

/** The kinds legal for a member of an object. */
type ObjectMemberKind = ("method" | "accessor" | "property") | ExtendedObjectMemberKinds;

/** The known subtypes of MemberMirror */
type ObjectMemberLikeMirror = MemberMirror | MethodMirror | AccessorMirror | PropertyMirror;

/** Options used to filter object members. */
interface ObjectMemberFilter {
    /**
     * Indicates whether to only include own members.
     *
     * If true, only own members will be included.
     * If false or undefined, own members will be unioned with members defined on the prototype chain.
     */
    own?: boolean,

    /**
     * Indicates the kind of members to include.
     *
     * If "method", only methods will be included.
     * If "accessor", only accessors will be included.
     * If "property", only data properties will be included.
     * If undefined, all members will be included.
     */
    kind?: ObjectMemberKind;
}

/** Options used to filter object members. */
interface ObjectMemberDeleteFilter {
    /**
     * Indicates the kind of members to include.
     *
     * If "method", only methods will be included.
     * If "accessor", only accessors will be included.
     * If "property", only data properties will be included.
     * If undefined, all members will be included.
     */
    kind?: ObjectMemberKind;
}

//
// Extensions
//
// Forward declarations for future extensions to the core proposal.

/** Extended member mirror kinds reserved for future proposals. */
type ExtendedObjectMemberKinds = "private";
