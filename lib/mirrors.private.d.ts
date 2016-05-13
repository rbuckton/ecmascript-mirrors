/// <reference path="mirrors.d.ts" />

declare namespace Reflect {
    function get(target: any, propertyKey: PropertyKey | PrivateSlot, receiver?: any): any;
    function set(target: any, propertyKey: PropertyKey | PrivateSlot, value: any, receiver?: any): boolean;
}

/** A private slot defined on an object or class. */
interface PrivateSlot {
    /** Gets the name for this slot. */
    readonly name: string | undefined;

    /**
     * Gets a value indicating whether the private slot is defined on the object.
     *
     * @param object An object.
     * @returns True if the slot is defined on the object; otherwise, false.
     * @throws This method will throw an error if object is not an Object or is null.
     */
    isDefined(object: Object): boolean;

    /**
     * Gets the value of the private slot on an object.
     *
     * @param object An object.
     * @returns The current value of the private slot.
     * @throws This method will throw an error if object is not an Object, is null, or does not
     *      have the private slot defined.
     */
    getValue(object: Object): any;

    /**
     * Sets the value of a private slot on an object.
     *
     * @param object An object.
     * @param value The value.
     * @returns True if the object has the private slot defined and the value was set
     *      successfully; otherwise, false.
     * @throws This method will throw an error if object is not an Object or is null.
     */
    setValue(object: Object, value: any): boolean;
}

/** A Mirror for a class declaration or class expression. */
interface ClassMirror extends Mirror {
    /**
     * Gets the members of a class.
     *
     * Members whose names are PrivateSlot objects will only be returned if the mirror's state is
     * "declaration".
     *
     * @param filter Options used to filter members.
     * @returns An Iterable of members that match the provided filter.
     */
    getMembers(filter?: ClassMemberFilter): Iterable<ClassMemberLikeMirror>;

    /**
     * Defines an opaque private slot.
     *
     * @param name The name of the private slot.
     * @returns A PrivateSlot.
     * @throws This method will throw an error if the mirror's state not "declaration".
     */
    definePrivateSlot(name?: string): PrivateSlot;
}