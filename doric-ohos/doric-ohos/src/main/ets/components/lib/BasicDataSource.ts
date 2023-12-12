/**
 * Data Change Listener.
 * @since 7
 */
declare interface DataChangeListener {
  /**
   * Data ready.
   * @since 7
   */
  onDataReloaded(): void;
  /**
   * Data added.
   * @since 7
   * @deprecated since 8
   * @useinstead onDataAdd
   */
  onDataAdded(index: number): void;
  /**
   * Data added.
   * @since 8
   */
  onDataAdd(index: number): void;
  /**
   * Data moved.
   * @since 7
   * @deprecated since 8
   * @useinstead onDataMove
   */
  onDataMoved(from: number, to: number): void;
  /**
   * Data moved.
   * @since 8
   */
  onDataMove(from: number, to: number): void;
  /**
   * Data deleted.
   * @since 7
   * @deprecated since 8
   * @useinstead onDataDelete
   */
  onDataDeleted(index: number): void;
  /**
   * Data deleted.
   * @since 8
   */
  onDataDelete(index: number): void;
  /**
   * Call when has data change.
   * @since 7
   * @deprecated since 8
   * @useinstead onDataChange
   */
  onDataChanged(index: number): void;
  /**
   * Call when has data change.
   * @since 8
   */
  onDataChange(index: number): void;
}
/**
 * Developers need to implement this interface to provide data to LazyForEach component.
 * @since 7
 */
declare interface IDataSource {
  /**
   * Total data count.
   * @since 7
   */
  totalCount(): number;
  /**
   * Return the data of index.
   * @since 7
   */
  getData(index: number): any;
  /**
   * Register data change listener.
   * @since 7
   */
  registerDataChangeListener(listener: DataChangeListener): void;
  /**
   * Unregister data change listener.
   * @since 7
   */
  unregisterDataChangeListener(listener: DataChangeListener): void;
}

export class BasicDataSource<T> implements IDataSource {
  private listeners: DataChangeListener[] = [];
  private originDataArray: T[] = [];

  public totalCount(): number {
    return 0;
  }

  public getData(index: number): T {
    return this.originDataArray[index];
  }

  registerDataChangeListener(listener: DataChangeListener): void {
    if (this.listeners.indexOf(listener) < 0) {
      console.info('add listener');
      this.listeners.push(listener);
    }
  }

  unregisterDataChangeListener(listener: DataChangeListener): void {
    const pos = this.listeners.indexOf(listener);
    if (pos >= 0) {
      console.info('remove listener');
      this.listeners.splice(pos, 1);
    }
  }

  notifyDataReload(): void {
    this.listeners.forEach(listener => {
      listener.onDataReloaded();
    })
  }

  notifyDataAdd(index: number): void {
    this.listeners.forEach(listener => {
      listener.onDataAdd(index);
    })
  }

  notifyDataChange(index: number): void {
    this.listeners.forEach(listener => {
      listener.onDataChange(index);
    })
  }

  notifyDataDelete(index: number): void {
    this.listeners.forEach(listener => {
      listener.onDataDelete(index);
    })
  }
}