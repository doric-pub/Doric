import { List as DoricList, View } from 'doric';
import { BasicDataSource } from '../lib/BasicDataSource';
import { DoricViewNode } from '../lib/DoricViewNode';
import { createDoricViewNode } from '../lib/Registry';
import { getGlobalObject, ViewStackProcessor } from '../lib/sandbox';

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

  pushing(v: DoricList) {
    const firstRender = this.lazyForEachElmtId === undefined;
    if (!firstRender && !this.view.isDirty()) {
      return;
    }

    if (firstRender) {
      this.lazyForEachElmtId = this.view.viewId + "_lazy_for_each"

      LazyForEach.create(this.lazyForEachElmtId, this, this.dataSource, (index: number) => {
        const child = this.view.renderItem(index)
        const childNode = createDoricViewNode(this.context, child)
        childNode.render()
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

    // commonConfig
    this.commonConfig(v)
  }
}
