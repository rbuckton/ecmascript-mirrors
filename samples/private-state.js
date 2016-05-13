// based on samples originally defined in https://github.com/wycats/javascript-decorators/blob/mirrors-spike/interop/private-state.md

class Person {
    @reader #first;
    @reader #last;

    constructor(first, last) {
        #first = first;
        #last = last;
    }

    @reader get #fullName() {
        return `${#first} ${#last}`;
    }
}

/**
 * Decorator that creates a public accessor around a private (or pseudo-private underscore-prefixed) member.
 *
 * @param mirror {MethodMirror|GetterMirror|SetterMirror|FieldMirror} The mirror to expose.
 */
function reader(mirror) {
    const classMirror = getDeclaringClass(mirror);
    if (!classMirror) return;

    const privateName = mirror.name;
    const publicName = getPublicName(privateName);
    if (publicName === privateName) return;

    classMirror.defineAccessor(publicName, {
        configurable: true,
        get: function() {
            return Reflect.get(this, privateName);
        },
        set: function(value) {
            return Reflect.set(this, privateName, value);
        }
    });
}

/**
 * Gets a public name to use for the member.
 *
 * @param memberName {string|symbol|PrivateSlot} The member name.
 */
function getPublicName(memberName) {
    if (typeof memberName === "string" && memberName.charAt(0) === "_") {
        return memberName.substr(1);
    }
    if (typeof memberName === "object") {
        return memberName.name;
    }
    return memberName;
}

/**
 * Gets the declaring class for a mirror.
 *
 * @param mirror {Mirror}
 * @returns {ClassMirror|undefined}
 */
function getDeclaringClass(mirror) {
    while (mirror && mirror.kind !== "class") {
        mirror = mirror.parent;
    }

    return mirror;
}

/*
// Desugaring
//
// The following is an approximate down-level desugaring to match the expected semantics.
// The actual host implementation would generally be more efficient.

const _first = declarePrivateSlot("first");
const _last = declarePrivateSlot("last");
const _fullName = declarePrivateSlot("fullName");
const _Person = declareClass(
    // Class declaration
    class {
        constructor(first, last) {
            // Ensures private slots are created on the instance.
            _Person.initializeInstance(this);
            _first.set(this, first);
            _last.set(this, last);
        }

        // define method using a unique identifier for _fullName to preserve super bindings.
        [_fullName.__uniqueIdentifier__()]() {
            return `${_first.get(this)} ${_last.get(this)}`;
        }
    },

    // Class description
    {
        name: "Person",
        members: [
            { kind: "field", name: _first, decorations: [reader] },
            { kind: "field", name: _last, decorations: [reader] },
            { kind: "method", name: _fullName, decorations: [reader] }
        ]
    }
);
let Person = _Person.finishDeclarationInitialization();
*/