export type DeepReadonly<T> =
    T extends (...args: any[]) => any
        ? T
        : T extends readonly (infer U)[]
            ? ReadonlyArray<DeepReadonly<U>>
            : T extends object
                ? {
                    readonly [K in keyof T]:
                        DeepReadonly<T[K]>;
                }
                : T;