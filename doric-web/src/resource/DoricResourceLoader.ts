export interface DoricResourceLoader {

    resourceType(): string

    load(identifier: string): Promise<string>

}

