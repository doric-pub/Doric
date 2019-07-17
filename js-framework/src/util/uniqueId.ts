let __uniqueId__: number = 0

export function uniqueId(prefix: string) {
    return `__${prefix}_${__uniqueId__++}__`;
}