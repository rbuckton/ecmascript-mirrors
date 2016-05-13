# ECMAScript Mirrors - Type Definitions

This folder contains a number of [TypeScript](http://github.com/Microsoft/TypeScript) declaration files for various parts of this proposal.

* [mirrors.d.ts] - The core mirror API.
* [mirrors.decorator.d.ts] - Decorator extensions to the core mirror API.
* [mirrors.field.d.ts] - Field (a.k.a "Class Property Initializers") mirror extensions to the core mirror API.
    * [mirrors.field+decorator.d.ts] - Decorator extensions to the Field mirror API.
    * [mirrors.field+metadata.d.ts] - Metadata extensions to the Field mirror API.
* [mirrors.object.d.ts] - Object literal mirror extensions to the core mirror API.
    * [mirrors.object+private.d.ts] - Private slot extensions to the Object literal mirror API.
* [mirrors.function.d.ts] - Function expression mirror extensions to the core mirror API.
    * [mirrors.function+decorator.d.ts] - Decorator extensions to the Function expression mirror API.
    * [mirrors.function+metadata.d.ts] - Metadata extensions to the Function expression mirror API.
    * [mirrors.function+parameter.d.ts] - Parameter mirror extensions to the Function expression mirror API.
* [mirrors.private.d.ts] - Private slot extensions to the core mirror API.
* [mirrors.parameter.d.ts] - Parameter mirror extensions to the core mirror API.
    * [mirrors.parameter+decorator.d.ts] - Decorator extensions to the Paramter mirror API.
    * [mirrors.parameter+metadata.d.ts] - Metadata extensions to the Parameter mirror API.
* [mirrors.metadata.d.ts] - Metadata extensions to the core mirror API.
* [mirrors.comprehensive.d.ts] - Comprehensive mirror API (references core mirror API and all extensions).