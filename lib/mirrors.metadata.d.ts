/// <reference path="mirrors.d.ts" />

/** A Mirror for a declaration. */
interface Declaration extends Mirror {
    /**
     * Gets a value indicating whether the provided metadata key exists.
     *
     * @param key The metadata key.
     * @param filter Options used to filter results.
     * @returns true if the mirror has the provided metadata key; otherwise, false.
     */
    hasMetadata(key: any, filter?: MetadataFilter): boolean;

    /**
     * Gets the metadata value for the provided metadata key.
     *
     * @param key The metadata key.
     * @param filter Options used to filter results.
     * @returns The metadata value if the provided key exists; otherwise, undefined.
     */
    getMetadata(key: any, filter?: MetadataFilter): any;

    /**
     * Gets the metadata keys for the declaration.
     *
     * @param filter Options used to filter results.
     * @returns An iterable of all defined metadata keys.
     */
    getMetadataKeys(filter?: MetadataFilter): Iterable<any>;

    /**
     * Gets the metadata keys and values for the declaration.
     *
     * @param filter Options used to filter results.
     * @returns An iterable of all defined metadata keys and values.
     */
    getMetadataEntries(filter?: MetadataFilter): Iterable<[any, any]>;

    /**
     * Defines a metadata key/value pair.
     *
     * @param key The metadata key.
     * @param value The metadata value.
     * @returns true if the metadata could be defined; otherwise, false.
     */
    defineMetadata(key: any, value: any): boolean;

    /**
     * Deletes metadata with the provided key.
     *
     * @param key The metadata key.
     * @returns true if the metadata could be deleted; otherwise false.
     */
    deleteMetadata(key: any): boolean;
}

/** Additional options provided to various methods on MetadataProvider. */
interface MetadataFilter {
    /**
     * Indicates whether to only include own metadata. Default false.
     *
     * If true, only metadata defined on this mirror is used.
     * If false, metadata from this mirror is unioned with metadata from any shadowed declaration
     * from each superclass.
     */
    own?: boolean;
}