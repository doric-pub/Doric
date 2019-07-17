let __uniqueId__: number = 0

export function uniqueId() {
    return `__unique_${__uniqueId__++}__`;
}