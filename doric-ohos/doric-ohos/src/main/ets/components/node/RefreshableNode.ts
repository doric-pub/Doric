import { Refreshable } from 'doric'
import { createDoricViewNode } from '../lib/Registry'
import { getGlobalObject, ViewStackProcessor } from '../lib/sandbox'
import { SuperNode } from '../lib/SuperNode'

const Refresh = getGlobalObject("Refresh")
const ForEach = getGlobalObject("ForEach")

export class RefreshableNode extends SuperNode<Refreshable> {
  TAG = Refresh

  forEachElmtId?: number

  private refreshing = false
  private enabled = true
  private dirty = false

  pushing(v: Refreshable) {
    const firstRender = this.forEachElmtId === undefined
    if (!firstRender && !this.view.isDirty()) {
      return
    }

    if (firstRender) {
      this.forEachElmtId = ViewStackProcessor.AllocateNewElmetIdForNextComponent()
    }
    [v.content].forEach((child) => {
      let childNode = this.childNodes.get(child.viewId)
      if (childNode) {
        childNode.render()
      }
    })

    ViewStackProcessor.StartGetAccessRecordingFor(this.forEachElmtId)
    ForEach.create()
    const children = [v.content]
    let diffIndexArray = [] // New indexes compared to old one.
    let newIdArray = children.map(e => e.viewId)
    let idDuplicates = []

    ForEach.setIdArray(this.forEachElmtId, newIdArray, diffIndexArray, idDuplicates)

    diffIndexArray.forEach((idx) => {
      const child = children[idx]
      let childNode = this.childNodes.get(child.viewId)
      if (!childNode) {
        childNode = createDoricViewNode(this.context, child)
        this.childNodes.set(child.viewId, childNode)
      }
      ForEach.createNewChildStart(childNode.view.viewId, this.context.viewPU)
      childNode.render()
      ForEach.createNewChildFinish(childNode.view.viewId, this.context.viewPU)
    })

    if (!firstRender) {
      ForEach.pop()
    }
    ViewStackProcessor.StopGetAccessRecording()
    if (firstRender) {
      ForEach.pop()
    } else {
      this.context.viewPU.finishUpdateFunc(this.forEachElmtId)
    }
  }

  pop() {
    Refresh.pop()
  }

  blend(v: Refreshable) {
    Refresh.create({
      refreshing: this.refreshing,
      offset: 120,
      friction: 100
    })

    // onRefresh
    if (v.onRefresh) {
      Refresh.onRefreshing(() => {
        v.onRefresh()
      })
    }

    Refresh.enabled(this.enabled)
  }

  blendSubNodes(v: Refreshable) {
  }

  private setRefreshable(props) {
    return new Promise((resolve, reject) => {
      let enabledChanged = false
      if (props !== undefined) {
        if (this.enabled !== props) {
          enabledChanged = true
          this.enabled = props
        }
      } else {
        if (this.enabled !== props) {
          enabledChanged = true
          this.enabled = false
        }
      }

      if (enabledChanged) {
        this.dirty = true
        this.render()
        this.dirty = false

        resolve("")
      }
    })
  }

  private setRefreshing(props) {
    return new Promise((resolve, reject) => {
      let refreshingChanged = false
      if (props !== undefined) {
        if (this.refreshing !== props) {
          refreshingChanged = true
          this.refreshing = props
        }
      } else {
        if (this.refreshing !== props) {
          refreshingChanged = true
          this.refreshing = false
        }
      }

      if (refreshingChanged) {
        this.dirty = true
        this.render()
        this.dirty = false

        resolve("")
      }

    })
  }

  private isRefreshable(props) {
    return new Promise((resolve, reject) => {
      resolve(this.enabled)
    })
  }

  private isRefreshing(props) {
    return new Promise((resolve, reject) => {
      resolve(this.refreshing)
    })
  }

  isSelfDirty() {
    return super.isSelfDirty() || this.dirty
  }
}