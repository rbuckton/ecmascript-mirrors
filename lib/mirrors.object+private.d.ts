/// <reference path="mirrors.object.d.ts" />
/// <reference path="mirrors.private.d.ts" />

/** A Mirror for an object literal or value. */
interface ObjectMirror extends Mirror {
    /**
     * Gets the members of a class.
     *
     * Members whose names are PrivateSlot objects will only be returned if the mirror's state is "declaration".
     *
     * @param filter Options used to filter members.
     * @returns An Iterable of members that match the provided filter.
     */
    getMembers(filter?: ClassMemberFilter): Iterable<MemberLikeMirror>;

    /**
     * Defines an opaque private slot.
     *
     * @param name The name of the private slot.
     * @returns A PrivateSlot.
     * @throws This method will throw an error if the mirror's state not "declaration".
     */
    definePrivateSlot(name?: string): PrivateSlot;
}