# Declaration-only Mirrors

This folder contains a prototype for a Mirror approach based solely on decorators.

For the purposes of this scenario, whenever a decorator is applied to a declaration a new
`Mirror` is allocated for the declaration. This `Mirror` allows the decorator to make changes
to the declaration before it is fully initialized. Once all decorators have been applied,
each `Mirror` becomes immutable, as they can no longer modify the declaration itself. At that point,
any further changes can only be made to the resulting value for the declaration by using existing
methods on `Object` and `Reflect`.

## Running the sample

1. First, build the prototype by running `tsc` from this directory.
2. Run the prototype in NodeJS using the following command:
   ```
   node --use_strict --harmony_rest_parameters --harmony_destructuring --harmony_proxies --harmony_reflect example
   ```