import { List as DoricList, ListItem as DoricListItem, View } from 'doric'
import { BasicDataSource } from '../lib/BasicDataSource'
import { createDoricViewNode } from '../lib/Registry'
import { getGlobalObject } from '../lib/sandbox'
import { SuperNode } from '../lib/SuperNode'
import { parseInspectorRect } from '../lib/util'

const List = getGlobalObject("List")
const LazyForEach = getGlobalObject("LazyForEach")
const Scroller = getGlobalObject("Scroller")

const LOAD_MORE_DATA = "loadMore"

class ViewDataSource extends BasicDataSource<string> {
  private dataArray: string[] = []
  public loadMore: boolean = false

  public totalCount(): number {
    return this.dataArray.length + ((this.loadMore) ? 1 : 0)
  }

  public getData(index: number): string {
    if (this.loadMore) {
      if (index >= this.dataArray.length) {
        return LOAD_MORE_DATA
      } else {
        return this.dataArray[index]
      }
    } else {
      return this.dataArray[index]
    }
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

export class ListNode extends SuperNode<DoricList> {
  TAG = List

  private scroller = new Scroller()

  private dataSource: ViewDataSource = new ViewDataSource()
  private lazyForEachElmtId?: string
  private reloadVersion: number = 0
  private dirtyVersion: Map<string, number> = new Map()
  private onLoadMore?: () => void
  private renderItem?: (index: number) => DoricListItem

  pushing(v: DoricList) {
    const firstRender = this.lazyForEachElmtId === undefined
    if (!firstRender && !v.isDirty()) {
      return
    }

    if (firstRender) {
      this.lazyForEachElmtId = v.viewId + "_lazy_for_each"

      LazyForEach.create(
        this.lazyForEachElmtId,
        this,
        this.dataSource,
        (item: string, position: number) => {
          console.log("DoricTag", `itemGen item: ${item}, position: ${position}`)
          let child: View
          if (item === LOAD_MORE_DATA) {
            if (v.loadMoreView) {
              child = v.loadMoreView
            } else {
              child = new DoricListItem()
            }
          } else {
            const cachedView = (v as any).cachedViews.get(`${position}`) as DoricListItem
            if (cachedView) {
              child = cachedView
            } else {
              (v as any).renderBunchedItems(position, 1)
              child = (v as any).cachedViews.get(`${position}`) as DoricListItem
            }
          }

          const childNode = createDoricViewNode(this.context, child)
          this.childNodes.set(child.viewId, childNode)
          childNode.render()

          // call onLoadMore
          if (this.dataSource.loadMore && position >= (this.dataSource.totalCount() - 1) && this.onLoadMore) {
            this.onLoadMore()
          }
        },
        (item: string, position: number) => {
          const key = item + "_" + this.reloadVersion + "_" + this.dirtyVersion.get(item)
          console.log("DoricTag", `keyGen item: ${key}`)
          return key
        },
      )
      LazyForEach.pop()
    }

    super.pushing(v)
  }

  pop() {
    List.pop()
  }

  blend(v: DoricList) {
    List.create({
      scroller: this.scroller
    })

    // itemCount
    if (v.itemCount) {
      if (this.dataSource.totalCount() < v.itemCount) {
        for (let i = this.dataSource.totalCount();i != v.itemCount; i++) {
          this.dataSource.pushData(i.toString())
        }
      } else {
        for (let i = this.dataSource.totalCount();i != v.itemCount; i--) {
          this.dataSource.deleteData(this.dataSource.totalCount() - 1)
        }
      }
    }

    // renderItem
    if (v.renderItem) {
      if (this.renderItem !== v.renderItem) {
        this.renderItem = v.renderItem
        this.dataSourceReload()
      }
    }

    // onLoadMore
    if (v.onLoadMore) {
      this.onLoadMore = v.onLoadMore
    }

    // loadMore
    if (v.loadMore) {
      this.dataSource.loadMore = v.loadMore
    }

    if (v.onScrollEnd) {
      List.onScrollStop(() => {
        const currentOffset = this.scroller.currentOffset()
        v.onScrollEnd({
          x: currentOffset.xOffset,
          y: currentOffset.yOffset
        })
      })
    }

    if (v.onScroll) {
      List.onScroll((scrollOffset, scrollState) => {
        v.onScroll({
          x: 0, y: scrollOffset
        })
      })
    }
    // commonConfig
    this.commonConfig(v);
  }

  blendSubNodes(v: DoricList) {
    (v as any).cachedViews.forEach((cachedView, key) => {
      if (cachedView.isDirty()) {
        const existedVersion = this.dirtyVersion.get(key.toString())
        if (existedVersion) {
          this.dirtyVersion.set(key.toString(), existedVersion + 1)
        } else {
          this.dirtyVersion.set(key.toString(), 1)
        }
        this.dataSource.notifyDataChange(key)
        console.log("DoricTag", `isDirty key: ${key}`)
      }
    })
  }

  private reload() {
    return new Promise((resolve, reject) => {
      ((this.view as any).cachedViews as Map<string, View>).clear()
      this.dataSourceReload()

      resolve("")
    })
  }

  private dataSourceReload() {
    this.reloadVersion++
    this.dataSource.reloadData()
  }

  private findCompletelyVisibleItems() {
    return new Promise((resolve, reject) => {
      const completelyVisibleItems: number[] = []

      const listRect = parseInspectorRect(JSON.parse(getInspectorByKey(this.view.viewId)).$rect)

      this.view.allSubviews().forEach((subview, index) => {
        const inspector = getInspectorByKey(subview.viewId)

        if (inspector !== "") {
          const listItemRect = parseInspectorRect(JSON.parse(inspector).$rect)
          if (listItemRect.top >= listRect.top && listItemRect.bottom <= listRect.bottom) {
            completelyVisibleItems.push(index)
          }
        }
      })
      resolve(completelyVisibleItems)
    })
  }

  private findVisibleItems() {
    return new Promise((resolve, reject) => {
      const visibleItems: number[] = []

      this.view.allSubviews().forEach((subview, index) => {
        const inspector = getInspectorByKey(subview.viewId)

        if (inspector !== "") {
          visibleItems.push(index)
        }
      })
      resolve(visibleItems)
    })
  }
}
