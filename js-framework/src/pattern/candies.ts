/*
 * Copyright [2019] [Doric.Pub]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export function take<T>(target: T) {
    return (block: (p: T) => void) => {
        block(target)
    }
}

export function takeNonNull<T, R>(target?: T) {
    return (block: (p: T) => R) => {
        if (target !== undefined) {
            return block(target)
        }
    }
}

export function takeNull<T, R>(target?: T) {
    return (block: () => R) => {
        if (target === undefined) {
            return block()
        }
    }
}

export function takeLet<T, R>(target: T) {
    return (block: (p: T) => R | undefined) => {
        return block(target)
    }
}

export function takeAlso<T>(target: T) {
    return (block: (p: T) => void) => {
        block(target)
        return target
    }
}

export function takeIf<T>(target: T) {
    return (predicate: (t: T) => boolean) => {
        return predicate(target) ? target : undefined
    }
}

export function takeUnless<T>(target: T) {
    return (predicate: (t: T) => boolean) => {
        return predicate(target) ? undefined : target
    }
}

export function repeat(action: (count: number) => void) {
    return (times: number) => {
        for (let i = 0; i < times; i++) {
            action(i)
        }
    }
}