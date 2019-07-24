let __uniqueId__ = 0
export function uniqueId(prefix: string) {
    return `__${prefix}_${__uniqueId__++}__`;
}