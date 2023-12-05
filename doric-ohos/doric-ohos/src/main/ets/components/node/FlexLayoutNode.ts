import { Align as DoricAlign, FlexDirection as DoricFlexDirection, FlexLayout, Justify, Wrap } from 'doric'
import { getGlobalObject } from '../lib/sandbox'
import { GroupNode } from '../lib/GroupNode'

const Flex = getGlobalObject("Flex")
const FlexDirection = getGlobalObject("FlexDirection")
const FlexWrap = getGlobalObject("FlexWrap")
const FlexAlign = getGlobalObject("FlexAlign")
const ItemAlign = getGlobalObject("ItemAlign")

export class FlexLayoutNode extends GroupNode<FlexLayout> {
  TAG = Flex

  pop() {
    Flex.pop();
  }

  blend(v: FlexLayout) {
    if (v.flexConfig) {
      let direction
      switch (v.flexConfig.flexDirection) {
        case DoricFlexDirection.COLUMN:
          direction = FlexDirection.Column
          break
        case DoricFlexDirection.COLUMN_REVERSE:
          direction = FlexDirection.ColumnReverse
          break
        case DoricFlexDirection.ROW:
          direction = FlexDirection.Row
          break
        case DoricFlexDirection.ROW_REVERSE:
          direction = FlexDirection.RowReverse
          break
      }

      let wrap
      switch (v.flexConfig.flexWrap) {
        case Wrap.NO_WRAP:
          wrap = FlexWrap.NoWrap
          break
        case Wrap.WRAP:
          wrap = FlexWrap.Wrap
          break
        case Wrap.WRAP_REVERSE:
          wrap = FlexWrap.WrapReverse
          break
      }

      let justifyContent
      switch (v.flexConfig.justifyContent) {
        case Justify.FLEX_START:
          justifyContent = FlexAlign.Start
          break
        case Justify.CENTER:
          justifyContent = FlexAlign.Center
          break
        case Justify.FLEX_END:
          justifyContent = FlexAlign.End
          break
        case Justify.SPACE_BETWEEN:
          justifyContent = FlexAlign.SpaceBetween
          break
        case Justify.SPACE_AROUND:
          justifyContent = FlexAlign.SpaceAround
          break
        case Justify.SPACE_EVENLY:
          justifyContent = FlexAlign.SpaceEvenly
          break
      }

      let alignItems
      switch (v.flexConfig.alignItems) {
        case DoricAlign.AUTO:
          alignItems = ItemAlign.Auto
          break
        case DoricAlign.FLEX_START:
          alignItems = ItemAlign.Start
          break
        case DoricAlign.CENTER:
          alignItems = ItemAlign.Center
          break
        case DoricAlign.FLEX_END:
          alignItems = ItemAlign.End
          break
        case DoricAlign.STRETCH:
          alignItems = ItemAlign.Stretch
          break
        case DoricAlign.BASELINE:
          alignItems = ItemAlign.Baseline
          break
      }

      let alignContent
      switch (v.flexConfig.alignContent) {
        case DoricAlign.FLEX_START:
          alignContent = FlexAlign.Start
          break
        case DoricAlign.CENTER:
          alignContent = FlexAlign.Center
          break
        case DoricAlign.FLEX_END:
          alignContent = FlexAlign.End
          break
        case DoricAlign.SPACE_BETWEEN:
          alignContent = FlexAlign.SpaceBetween
          break
        case DoricAlign.SPACE_AROUND:
          alignContent = FlexAlign.SpaceAround
          break
      }

      const flexOption = {
        ...(direction !== undefined ? { direction: direction } : {}),
        ...(wrap !== undefined ? { wrap: wrap } : {}),
        ...(justifyContent !== undefined ? { justifyContent: justifyContent } : {}),
        ...(alignItems !== undefined ? { alignItems: alignItems } : {}),
        ...(alignContent !== undefined ? { alignContent: alignContent } : {}),
      }
      Flex.create(flexOption);
    } else {
      Flex.create()
    }

    // commonConfig
    this.commonConfig(v)
  }
}
