// based on samples originally defined in https://github.com/wycats/javascript-decorators/blob/mirrors-spike/README.md

class Person {
    constructor(first, last) {
        this.first = first;
        this.last = last;
        Object.seal(this);
    }

    @nonconfigurable fullName() {
        return `${this.first} ${this.last}`;
    }

    @readonly name() {
        return `${this.first} ${this.last}`;
    }

    @enumerable kidCount() {
        return this.children.length;
    }
}

/**
 * Decorator that marks a member as non-configurable.
 *
 * @param mirror {MemberMirror} A class member mirror.
 */
function nonconfigurable(mirror) {
    mirror.configurable = false;
}

/**
 * Decorator that marks a member as enumerable.
 *
 * @param mirror {MemberMirror} A class member mirror.
 */
function enumerable(mirror) {
    mirror.enumerable = true;
}

/**
 * Decorator that marks a member as readonly.
 *
 * @param mirror {MethodMirror|PropertyMirror} A method or data property mirror..
 */
function readonly(mirror) {
    member.writable = false;
}