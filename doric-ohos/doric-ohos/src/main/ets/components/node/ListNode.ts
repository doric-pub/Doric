import { List as DoricList } from 'doric';
import { BasicDataSource } from '../lib/BasicDataSource';
import { DoricViewNode } from '../lib/DoricViewNode';
import { createDoricViewNode } from '../lib/Registry';
import { getGlobalObject } from '../lib/sandbox';

const List = getGlobalObject("List");
const LazyForEach = getGlobalObject("LazyForEach");

class ViewDataSource extends BasicDataSource<number> {
  private dataArray: number[] = [];

  public totalCount(): number {
    return this.dataArray.length;
  }

  public getData(index: number): number {
    return index;
  }

  public addData(index: number, data: number): void {
    this.dataArray.splice(index, 0, data);
    this.notifyDataAdd(index);
  }

  public pushData(data: number): void {
    this.dataArray.push(data);
    this.notifyDataAdd(this.dataArray.length - 1);
  }
}

export class ListNode extends DoricViewNode<DoricList> {
  TAG = List;
  private dataSource: ViewDataSource = new ViewDataSource();

  lazyForEachElmtId?: string;

  private loadMore?: boolean
  private onLoadMore?: () => void

  pushing(v: DoricList) {
    const firstRender = this.lazyForEachElmtId === undefined;
    if (!firstRender && !this.view.isDirty()) {
      return;
    }

    if (firstRender) {
      this.lazyForEachElmtId = this.view.viewId + "_lazy_for_each"

      LazyForEach.create(this.lazyForEachElmtId, this, this.dataSource, (position: number) => {
        const child = this.view.renderItem(position)
        const childNode = createDoricViewNode(this.context, child)
        childNode.render()

        if (this.loadMore && position >= (this.dataSource.totalCount() - 1) && this.onLoadMore) {
          this.onLoadMore();
        }
      })
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

    if (v.itemCount) {
      if (this.dataSource.totalCount() < v.itemCount) {
        for (let i = this.dataSource.totalCount();i != this.view.itemCount; i++) {
          this.dataSource.pushData(i)
        }
      }
    }

    if (v.loadMore) {
      this.loadMore = v.loadMore
      if (v.onLoadMore) {
        this.onLoadMore = v.onLoadMore
      }
    }

    // commonConfig
    this.commonConfig(v)
  }
}
