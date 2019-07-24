export class ViewModel<T extends Object> {
    data: T
    constructor(obj: T) {
        this.data = new Proxy(obj, {
            get: () => {

            }
        })
    }

}