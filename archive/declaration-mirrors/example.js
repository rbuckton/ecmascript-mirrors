var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var sms = require("source-map-support");
var decorator_1 = require("./mirrors/decorator");
sms.install();
function log(mirror) {
    const oldValue = mirror.value;
    mirror.value = function (...args) {
        console.log(`Called ${mirror.name}`);
        return oldValue.apply(this, args);
    };
}
const services = new Map();
function provide(serviceName) {
    return function (mirror) {
        services.set(serviceName || mirror.name, mirror);
    };
}
function getService(serviceName) {
    const mirror = services.get(serviceName);
    return mirror ? Reflect.construct(mirror.construct, []) : undefined;
}
// NOTE: __mirror must be the first decorator on the class, in document order and must
//       appear when adapting current TypeScript decorators to mirror decorators.
// NOTE: __ (alias of __adapt, above) must wrap every decorator used to adapt a mirror
//       decorator to a TypeScript decorator
let MyUserService = class {
    method() {
    }
};
__decorate([
    decorator_1.__adapt(log)
], MyUserService.prototype, "method", null);
MyUserService = __decorate([
    decorator_1.__mirror,
    decorator_1.__adapt(provide("UserService"))
], MyUserService);
let c = getService("UserService");
c.method();
//# sourceMappingURL=example.js.map