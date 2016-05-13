var mirror_1 = require("./mirror");
class ParameterMirror extends mirror_1.Mirror {
    constructor(parent, index) {
        super();
        this._parent = parent;
        this._index = index;
    }
}
exports.ParameterMirror = ParameterMirror;
function getParameterMirrors(parent, reference) {
    const parameters = [];
    if (parent.kind === "class" || parent.kind === "method") {
        for (let i = 0; i < reference.length; i++) {
            const parameter = new ParameterMirror(parent, i);
            parameters.push(parameter);
        }
    }
    return parameters;
}
exports.getParameterMirrors = getParameterMirrors;
//# sourceMappingURL=parameter.js.map