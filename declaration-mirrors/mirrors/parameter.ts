import { Mirror } from "./mirror";
import { ClassMirror } from "./class";
import { FunctionMirror } from "./function";
import { MethodMirror, AccessorMirror } from "./property";

export class ParameterMirror extends Mirror {
    private _parent: Mirror;
    private _index: number;

    constructor(parent: Mirror, index: number) {
        super();
        this._parent = parent;
        this._index = index;
    }
}

export function getParameterMirrors(parent: Mirror, reference: Function): ParameterMirror[] {
    const parameters: ParameterMirror[] = [];
    if (parent.kind === "class" || parent.kind === "method") {
        for (let i = 0; i < reference.length; i++) {
            const parameter = new ParameterMirror(parent, i);
            parameters.push(parameter);
        }
    }

    return parameters
}