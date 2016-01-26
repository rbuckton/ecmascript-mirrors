import * as sms from "source-map-support";
import { __mirror, __adapt as __ } from "./mirrors/decorator";
import { Mirror, ClassMirror, PropertyMirror, MethodMirror, ParameterMirror } from "./mirrors";

sms.install();

function log(mirror: MethodMirror) {
    const oldValue = mirror.value;
    mirror.value = function (...args: any[]) {
        console.log(`Called ${mirror.name}`);
        return oldValue.apply(this, args);
    };
}

const services = new Map<string, ClassMirror>();
function provide(serviceName?: string) {
    return function (mirror: ClassMirror) {
        services.set(serviceName || mirror.name, mirror);
    };
}

function getService<T>(serviceName: string): T {
    const mirror = services.get(serviceName);
    return mirror ? <T>Reflect.construct(mirror.construct, []) : undefined;
}

// NOTE: __mirror must be the first decorator on the class, in document order and must
//       appear when adapting current TypeScript decorators to mirror decorators.

// NOTE: __ (alias of __adapt, above) must wrap every decorator used to adapt a mirror
//       decorator to a TypeScript decorator

@__mirror
@__(provide("UserService"))
class MyUserService {

    @__(log)
    method() {

    }
}

let c = getService<MyUserService>("UserService");
c.method();