let obj = {
    @readonly firstName: "first",
    @readonly lastName: "last",
    @nonconfigurable fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
};

/*
// Desugaring
//
// The following is an approximate down-level desugaring to match the expected semantics.
// The actual host implementation would generally be more efficient.

let obj = declareObject(
    // Object literal declaration
    {
        firstName: "first",
        lastName: "last",
        fullName() {
            return `${this.firstName} ${this.lastName}`;
        }
    },

    // Object description
    {
        members: [
            { kind: "property", name: "firstName", decorations: [readonly] },
            { kind: "property", name: "lastName", decorations: [readonly] },
            { kind: "method", name: "fullName", decorations: [nonconfigurable] }
        ]
    }
).finishDeclarationInitialization();
*/