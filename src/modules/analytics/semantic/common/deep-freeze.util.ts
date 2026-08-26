import { DeepReadonly } from '../contracts/deep-readonly.type';

export function deepFreeze<T>(
    value: T,
): DeepReadonly<T> {
    if (
        value === null ||
        value === undefined ||
        typeof value !== 'object'
    ) {
        return value as DeepReadonly<T>;
    }

    if (Object.isFrozen(value)) {
        return value as DeepReadonly<T>;
    }

    const object =
        value as Record<
            string | symbol,
            unknown
        >;

    for (const key of Reflect.ownKeys(object)) {
        const property = object[key];

        if (
            property !== null &&
            property !== undefined &&
            typeof property === 'object' &&
            !Object.isFrozen(property)
        ) {
            deepFreeze(property);
        }
    }

    Object.freeze(value);

    return value as DeepReadonly<T>;
}