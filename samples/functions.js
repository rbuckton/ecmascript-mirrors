// Decorate function expressions
let add1 = @log function(x, y) { return x + y; };

// Decorate arrow functions
let add2 = @log (x, y) => x + y;

// Proposal: Decorate function declarations using "const":
@log
const function add4(x, y) {
    return x + y;
}

/*
// Desugaring
//
// The following is an approximate down-level desugaring to match the expected semantics.
// The actual host implementation would generally be more efficient.

let add1 = declareFunction(
    // Function declaration
    function (x, y) { return x + y; },

    // Function description
    { name: "add1", decorations: [log] }
).finishDeclarationInitialization();

let add2 = declareFunction(
    // Function declaration
    (x, y) => x + y,

    // Function description
    { name: "add2", decorations: [log] }
).finishDeclarationInitialization();

const add4 = declareFunction(
    // Function declaration
    function (x, y) {
        return x + y;
    },

    // Function description
    { name: "add4", decorations: [log] }
).finishDeclarationInitialization();
*/