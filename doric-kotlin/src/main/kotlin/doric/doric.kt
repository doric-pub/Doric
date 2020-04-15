package doric

typealias Setter<M> = (state: M) -> Unit

typealias ViewModelClass<M, V> = Any

typealias ViewHolderClass<V> = Any

typealias Observer<T> = (v: T) -> Unit

typealias Updater<T> = (v: T) -> T

typealias Binder<T> = (v: T) -> Unit
