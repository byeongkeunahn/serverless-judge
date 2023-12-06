
    export function has_prop(target, prop) { return prop in Object(target); }
    export function get_prop(target, prop) { return target[prop]; }
    export function set_prop(target, prop, value) { target[prop] = value; }
    export function type_of(a) { return typeof a; }
    export function instance_of(lhs, rhs) { return lhs instanceof rhs; }
    export function call_func(func, args) { return func(...args); }
    export function call_method(obj, method, args) { return obj[method](...args) }
    export function wrap_closure(closure) {
        return function pyfunction(...args) {
            closure(this, args)
        }
    }
    