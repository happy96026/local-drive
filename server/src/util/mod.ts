function lazy<This extends object, Return>(
    getter: (this: This) => Return,
    context: DecoratorContext,
): (this: This) => Return {
    if (context.kind === "getter") {
        return function lazyGetter(this: This): Return {
            const result = getter.call(this)
            Object.defineProperty(this, context.name, {
                value: result,
                writable: false,
            })

            return result
        }
    }

    throw new Error(`Context kind ${context.kind} is not supported.`)
}

export { lazy }
