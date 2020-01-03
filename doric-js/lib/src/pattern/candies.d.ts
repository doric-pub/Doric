export declare function take<T>(target: T): (block: (p: T) => void) => void;
export declare function takeNonNull<T, R>(target?: T): (block: (p: T) => R) => R | undefined;
export declare function takeNull<T, R>(target?: T): (block: () => R) => R | undefined;
export declare function takeLet<T, R>(target: T): (block: (p: T) => R | undefined) => R | undefined;
export declare function takeAlso<T>(target: T): (block: (p: T) => void) => T;
export declare function takeIf<T>(target: T): (predicate: (t: T) => boolean) => T | undefined;
export declare function takeUnless<T>(target: T): (predicate: (t: T) => boolean) => T | undefined;
export declare function repeat(action: (count: number) => void): (times: number) => void;
