export interface Modeling {
    toModel(): Model
}

export type Model = string | number | boolean | Modeling | { [index: string]: Model | undefined }