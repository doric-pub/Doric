import { List as DoricList } from 'doric'
import { BasicDataSource } from '../lib/BasicDataSource'
import { DoricViewNode } from '../lib/DoricViewNode'
import { createDoricViewNode } from '../lib/Registry'
import { getGlobalObject } from '../lib/sandbox'

const List = getGlobalObject("List")
const LazyForEach = getGlobalObject("LazyForEach")

class ViewDataSource extends BasicDataSource<string> {
  private dataArray: string[] = []

  public totalCount(): number {
    return this.dataArray.length
  }

  public getData(index: number): string {
    return this.dataArray[index]
  }

  public addData(index: number, data: string): void {
    this.dataArray.splice(index, 0, data)
    this.notifyDataAdd(index)
  }

  public pushData(data: string): void {
    this.dataArray.push(data)
    this.notifyDataAdd(this.dataArray.length - 1)
  }

  public deleteData(index: number): void {
    this.dataArray.splice(index, 1)
    this.notifyDataDelete(index)
  }

  public changeData(index: number): void {
    this.notifyDataChange(index)
  }

  public reloadData(): void {
    this.notifyDataReload()
  }
}

export class ListNode extends DoricViewNode<DoricList> {
  TAG = List

  private dataSource: ViewDataSource = new ViewDataSource()
  private lazyForEachElmtId?: string
  private renderItemVersion: number = 0

  private loadMore?: boolean
  private onLoadMore?: () => void

  pushing(v: DoricList) {
    const firstRender = this.lazyForEachElmtId === undefined
    if (!firstRender && !this.view.isDirty()) {
      return
    }

    if (firstRender) {
      this.lazyForEachElmtId = this.view.viewId + "_lazy_for_each"

      LazyForEach.create(
        this.lazyForEachElmtId,
        this,
        this.dataSource,
        (item: string, position: number) => {
          const child = this.view.renderItem(position)
          const childNode = createDoricViewNode(this.context, child)
          childNode.render()

          if (this.loadMore && position >= (this.dataSource.totalCount() - 1) && this.onLoadMore) {
            this.onLoadMore()
          }
        },
        (item: string) => {
          console.log("DoricTag", this.renderItemVersion.toString())
          return (item + "_" + this.renderItemVersion)
        },
      )
      LazyForEach.pop()
    } else {
      console.log("")
    }
  }

  pop() {
    List.pop()
  }

  blend(v: DoricList) {
    List.create()

    // itemCount
    if (v.itemCount) {
      if (this.dataSource.totalCount() < v.itemCount) {
        for (let i = this.dataSource.totalCount();i != this.view.itemCount; i++) {
          this.dataSource.pushData(i.toString())
        }
      } else {
        for (let i = this.dataSource.totalCount();i != this.view.itemCount; i--) {
          this.dataSource.deleteData(this.dataSource.totalCount() - 1)
        }
      }
    }

    // renderItem
    if (v.renderItem) {
      this.renderItemVersion++
      this.dataSource.reloadData()
    }

    // onLoadMore
    if (v.onLoadMore) {
      this.onLoadMore = v.onLoadMore
    }

    // loadMore
    if (v.loadMore) {
      this.loadMore = v.loadMore
    }

    // commonConfig
    this.commonConfig(v)
  }
}
