// based on samples originally defined in https://github.com/wycats/javascript-decorators/blob/mirrors-spike/interop/initializer.md

class Person {
    @readonly born = new Date();
}

/**
 * Decorator that marks a member as readonly.
 *
 * @param mirror {MethodMirror|PropertyMirror} A method or data property mirror.
 */
function readonly(mirror) {
    member.writable = false;
}

/*
// Desugaring (assumes declareClass helper to instantiate "declaration" mirrors).
//
// The following is an approximate down-level desugaring to match the expected semantics.
// The actual host implementation would generally be more efficient.

const _Person = declareClass(

    // Class Declaration (for declaring the class prior to evaluating decorators)
    class {
        born;
        constructor() {
            // Evaluate per-instance field initializers
            _Person.initializeInstance(this);
        }
    },

    // Class Description (for creating mirrors and evaluating decorators)
    {
        name: "Person",
        members: [
            { kind: "field", name: "born", decorations: [readonly], initializer: () => new Date() }
        ]
    }
);

// Evaluate decorators and static field initializers.
let Person = _Person.finishDeclarationInitialization();
*/