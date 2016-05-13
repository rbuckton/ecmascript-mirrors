/// <reference path="mirrors.parameter.d.ts" />
/// <reference path="mirrors.metadata.d.ts" />

interface ParameterMirror extends DeclarationMirror {
    /**
     * Gets a value indicating whether the provided metadata key exists. (Inherited from DeclarationMirror)
     *
     * @param key The metadata key.
     * @param filter Options used to filter results.
     * @returns true if the mirror has the provided metadata key; otherwise, false.
     */
    hasMetadata(key: any, filter?: MetadataFilter): boolean;

    /**
     * Gets the metadata value for the provided metadata key. (Inherited from DeclarationMirror)
     *
     * @param key The metadata key.
     * @param filter Options used to filter results.
     * @returns The metadata value if the provided key exists; otherwise, undefined.
     */
    getMetadata(key: any, filter?: MetadataFilter): any;

    /**
     * Gets the metadata keys for the declaration. (Inherited from DeclarationMirror)
     *
     * @param filter Options used to filter results.
     * @returns An iterable of all defined metadata keys.
     */
    getMetadataKeys(filter?: MetadataFilter): Iterable<any>;

    /**
     * Gets the metadata keys and values for the declaration. (Inherited from DeclarationMirror)
     *
     * @param filter Options used to filter results.
     * @returns An iterable of all defined metadata keys and values.
     */
    getMetadataEntries(filter?: MetadataFilter): Iterable<[any, any]>;

    /**
     * Defines a metadata key/value pair. (Inherited from DeclarationMirror)
     *
     * @param key The metadata key.
     * @param value The metadata value.
     * @returns true if the metadata could be defined; otherwise, false.
     */
    defineMetadata(key: any, value: any): boolean;

    /**
     * Deletes metadata with the provided key. (Inherited from DeclarationMirror)
     *
     * @param key The metadata key.
     * @returns true if the metadata could be deleted; otherwise false.
     */
    deleteMetadata(key: any): boolean;
}