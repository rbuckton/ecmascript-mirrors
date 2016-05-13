// based on samples originally defined in https://github.com/wycats/javascript-decorators/blob/mirrors-spike/README.md

class Person {
    @memoize
    get name() { return `${this.first} ${this.last}`; }
    set name(value) { [this.first, this.last] = value.split(" "); }
}

/**
 * Decorator to memoize an accessor.
 *
 * @param mirror {GetAccessor|SetAccessor} A get or set accessor mirror.
 */
function memoize(mirror) {
    const accessor = mirror.parent;
    if (accessor.getter) {
        const getter = accessor.getter.value;
        accessor.getter.value = function () {
            const table = memoizationFor(this);
            if (table.has(name)) {
                return table.get(name);
            }

            const value = getter.call(this);
            table.set(name, value);
            return value;
        };
    }
    if (accessor.setter) {
        const setter = accessor.setter.value;
        accessor.setter.value = function (value) {
            const table = memoizationFor(this);
            setter.call(this, value);
            table.set(this, value);
            return value;
        };
    }
}

const memoized = new WeakMap();

function memoizationFor(obj) {
    if (memoized.has(obj)) {
        return memoized.get(obj);
    }

    const table = new Map();
    memoized.set(obj, table);
    return table;
}