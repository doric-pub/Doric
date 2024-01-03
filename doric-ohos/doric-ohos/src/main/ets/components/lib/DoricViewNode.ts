import {
  Align as DoricAlign,
  Color as DoricColor,
  FlexTypedValue,
  FlexValue,
  GradientColor,
  GradientOrientation,
  LayoutSpec,
  View,
} from 'doric'
import Animator, { AnimatorOptions } from '@ohos.animator'
import { DoricContext, getGlobalObject, ViewStackProcessor } from './sandbox'

const GradientDirection = getGlobalObject("GradientDirection")
const Visibility = getGlobalObject("Visibility")
const ItemAlign = getGlobalObject("ItemAlign")
const Color = getGlobalObject("Color")

export abstract class DoricViewNode<T extends View> {
  context: DoricContext

  elmtId?: number
  view: T

  firstRender = false

  abstract TAG: any

  constructor(context: DoricContext, t: T) {
    this.context = context
    this.view = t
  }

  render() {
    const firstRender = this.elmtId === undefined
    if (firstRender) {
      this.elmtId = ViewStackProcessor.AllocateNewElmetIdForNextComponent()
    }
    if (firstRender || this.isSelfDirty()) {
      ViewStackProcessor.StartGetAccessRecordingFor(this.elmtId)
      if (firstRender || this.isSelfDirty()) {
        this.blend(this.view)
      }
      if (!firstRender) {
        this.pop()
      }
      ViewStackProcessor.StopGetAccessRecording()
      if (!firstRender) {
        this.context.viewPU.finishUpdateFunc(this.elmtId)
      }
    }
    this.pushing(this.view)
    if (firstRender) {
      this.pop()
    }
  }

  isSelfDirty() {
    return this.view.isDirty()
  }

  abstract pushing(v: T)

  abstract blend(v: T)

  abstract pop()

  commonConfig(v: T) {
    this.TAG.id(v.viewId) // for inspector

    this.TAG.clip(true)

    // x
    let marginLeft
    if (v.x) {
      marginLeft = v.x
    }

    // y
    let marginTop
    if (v.y) {
      marginTop = v.y
    }

    this.TAG.margin({
      left: marginLeft ?? 0,
      top: marginTop ?? 0,
    })

    // onClick
    if (v.onClick) {
      this.TAG.onClick(() => {
        Reflect.apply(v.onClick, v, [])
      })
    }

    // backgroundColor
    if (v.backgroundColor instanceof DoricColor) {
      /// pure color
      if (v.backgroundColor !== DoricColor.TRANSPARENT) {
        this.TAG.backgroundColor(v.backgroundColor.toModel())
      } else {
        this.TAG.backgroundColor(Color.Transparent)
      }
    } else if (v.backgroundColor instanceof Object) {
      /// gradient color
      const gradientColor = v.backgroundColor as GradientColor

      let direction
      switch (gradientColor.orientation) {
        case GradientOrientation.TOP_BOTTOM:
          direction = GradientDirection.Bottom
          break
        case GradientOrientation.TR_BL:
          direction = GradientDirection.LeftBottom
          break
        case GradientOrientation.RIGHT_LEFT:
          direction = GradientDirection.Left
          break
        case GradientOrientation.BR_TL:
          direction = GradientDirection.LeftTop
          break
        case GradientOrientation.BOTTOM_TOP:
          direction = GradientDirection.Top
          break
        case GradientOrientation.BL_TR:
          direction = GradientDirection.RightTop
          break
        case GradientOrientation.LEFT_RIGHT:
          direction = GradientDirection.Right
          break
        case GradientOrientation.TL_BR:
          direction = GradientDirection.RightBottom
          break
      }

      const colors = []
      if (gradientColor.start && gradientColor.end) {
        colors.push([gradientColor.start, 0])
        colors.push([gradientColor.end, 1])
      } else if (gradientColor.colors) {
        if (gradientColor.locations && gradientColor.colors.length === gradientColor.locations.length) {
          gradientColor.colors.forEach((color, index) => {
            colors.push([color, gradientColor.locations[index]])
          })
        } else {
          gradientColor.colors.forEach((color, index) => {
            colors.push([color, 0 + 1 / (gradientColor.colors.length - 1) * index])
          })
        }
      }
      this.TAG.linearGradient({
        direction: direction,
        colors: colors
      })
    }

    // alpha
    if (v.alpha !== undefined) {
      this.TAG.opacity(v.alpha)
    }

    // border
    if (v.border) {
      this.TAG.borderWidth(v.border.width)
      this.TAG.borderColor(v.border.color)
    }

    // corners
    if (v.corners) {
      if (typeof v.corners === "number") {
        this.TAG.borderRadius(v.corners)
      } else if (typeof v.corners === "object") {
        const corners = v.corners as {
          leftTop?: number
          rightTop?: number
          leftBottom?: number
          rightBottom?: number
        }
        this.TAG.borderRadius({
          topLeft: corners.leftTop?? 0,
          topRight: corners.rightTop?? 0,
          bottomLeft: corners.leftBottom?? 0,
          bottomRight: corners.rightBottom?? 0,
        })
      }
    }

    // shadow
    if (v.shadow) {
      this.TAG.shadow(v.shadow)
    }

    // translationX & translationY
    if (v.translationX || v.translationY) {
      const translateOptions = {} as any
      if (v.translationX) {
        translateOptions.x = v.translationX
      }
      if (v.translationX) {
        translateOptions.y = v.translationY
      }
      this.TAG.translate(translateOptions)
    }

    // hidden
    this.TAG.visibility(v.hidden ? Visibility.None : Visibility.Visible)

    // flexConfig
    if (v.flexConfig) {
      /// width
      if (v.flexConfig.width) {
        this.TAG.width(this.getFlexTypedValue(v.flexConfig.width))
      }

      /// height
      if (v.flexConfig.height) {
        this.TAG.height(this.getFlexTypedValue(v.flexConfig.height))
      }

      /// marginLeft & marginStart & marginHorizontal
      let marginLeft
      if (v.flexConfig.marginLeft) {
        marginLeft = this.getFlexTypedValue(v.flexConfig.marginLeft)
      }
      if (v.flexConfig.marginStart) {
        marginLeft = this.getFlexTypedValue(v.flexConfig.marginStart)
      }
      if (v.flexConfig.marginHorizontal) {
        marginLeft = this.getFlexTypedValue(v.flexConfig.marginHorizontal)
      }

      /// marginRight & marginEnd & marginHorizontal
      let marginRight
      if (v.flexConfig.marginRight) {
        marginRight = this.getFlexTypedValue(v.flexConfig.marginRight)
      }
      if (v.flexConfig.marginEnd) {
        marginRight = this.getFlexTypedValue(v.flexConfig.marginEnd)
      }
      if (v.flexConfig.marginHorizontal) {
        marginRight = this.getFlexTypedValue(v.flexConfig.marginHorizontal)
      }

      /// marginTop & marginVertical
      let marginTop
      if (v.flexConfig.marginTop) {
        marginTop = this.getFlexTypedValue(v.flexConfig.marginTop)
      }
      if (v.flexConfig.marginVertical) {
        marginTop = this.getFlexTypedValue(v.flexConfig.marginVertical)
      }

      /// marginBottom & marginVertical
      let marginBottom
      if (v.flexConfig.marginBottom) {
        marginBottom = this.getFlexTypedValue(v.flexConfig.marginBottom)
      }
      if (v.flexConfig.marginVertical) {
        marginBottom = this.getFlexTypedValue(v.flexConfig.marginVertical)
      }

      this.TAG.margin({
        left: marginLeft ?? 0,
        right: marginRight ?? 0,
        top: marginTop ?? 0,
        bottom: marginBottom ?? 0,
      })

      /// margin
      if (v.flexConfig.margin) {
        this.TAG.margin(this.getFlexTypedValue(v.flexConfig.margin))
      }

      /// paddingLeft & paddingStart & paddingHorizontal
      let paddingLeft
      if (v.flexConfig.paddingLeft) {
        paddingLeft = this.getFlexTypedValue(v.flexConfig.paddingLeft)
      }
      if (v.flexConfig.paddingStart) {
        paddingLeft = this.getFlexTypedValue(v.flexConfig.paddingStart)
      }
      if (v.flexConfig.paddingHorizontal) {
        paddingLeft = this.getFlexTypedValue(v.flexConfig.paddingHorizontal)
      }

      /// paddingRight & paddingEnd & paddingHorizontal
      let paddingRight
      if (v.flexConfig.paddingRight) {
        paddingRight = this.getFlexTypedValue(v.flexConfig.paddingRight)
      }
      if (v.flexConfig.paddingEnd) {
        paddingRight = this.getFlexTypedValue(v.flexConfig.paddingEnd)
      }
      if (v.flexConfig.paddingHorizontal) {
        paddingRight = this.getFlexTypedValue(v.flexConfig.paddingHorizontal)
      }

      /// paddingTop & paddingVertical
      let paddingTop
      if (v.flexConfig.paddingTop) {
        paddingTop = this.getFlexTypedValue(v.flexConfig.paddingTop)
      }
      if (v.flexConfig.paddingVertical) {
        paddingTop = this.getFlexTypedValue(v.flexConfig.paddingVertical)
      }

      /// paddingBottom & marginVertical
      let paddingBottom
      if (v.flexConfig.paddingBottom) {
        paddingBottom = this.getFlexTypedValue(v.flexConfig.paddingBottom)
      }
      if (v.flexConfig.paddingVertical) {
        paddingBottom = this.getFlexTypedValue(v.flexConfig.paddingVertical)
      }

      this.TAG.padding({
        left: paddingLeft ?? 0,
        right: paddingRight ?? 0,
        top: paddingTop ?? 0,
        bottom: paddingBottom ?? 0,
      })

      /// padding
      if (v.flexConfig.padding) {
        this.TAG.padding(this.getFlexTypedValue(v.flexConfig.padding))
      }

      /// alignSelf
      let alignSelf
      switch (v.flexConfig.alignSelf) {
        case DoricAlign.AUTO:
          alignSelf = ItemAlign.Auto
          break
        case DoricAlign.FLEX_START:
          alignSelf = ItemAlign.Start
          break
        case DoricAlign.CENTER:
          alignSelf = ItemAlign.Center
          break
        case DoricAlign.FLEX_END:
          alignSelf = ItemAlign.End
          break
        case DoricAlign.STRETCH:
          alignSelf = ItemAlign.Stretch
          break
        case DoricAlign.BASELINE:
          alignSelf = ItemAlign.Baseline
          break
      }

      if (alignSelf) {
        this.TAG.alignSelf(alignSelf)
      }

      /// flexGrow
      if (v.flexConfig.flexGrow) {
        this.TAG.flexGrow(v.flexConfig.flexGrow)
      }

      /// flexShrink
      if (v.flexConfig.flexShrink) {
        this.TAG.flexShrink(v.flexConfig.flexShrink)
      }

      /// flexBasis
      if (v.flexConfig.flexBasis) {
        this.TAG.flexBasis(this.getFlexTypedValue(v.flexConfig.flexBasis))
      }
    }

    // layoutConfig
    /// margin
    if (v.layoutConfig?.margin) {
      this.TAG.margin(v.layoutConfig?.margin)
    }
    /// weight
    if (v.layoutConfig?.weight) {
      this.TAG.layoutWeight(v.layoutConfig?.weight)
    }

    const widthSpec = v.layoutConfig?.widthSpec?? LayoutSpec.JUST
    const heightSpec = v.layoutConfig?.heightSpec?? LayoutSpec.JUST
    switch (widthSpec) {
      case LayoutSpec.FIT:
        break
      case LayoutSpec.MOST:
        this.TAG.width("100%")
        break
      case LayoutSpec.JUST:
      default:
        this.TAG.width(v.width)
        break
    }

    switch (heightSpec) {
      case LayoutSpec.MOST:
        this.TAG.height("100%")
        break
      case LayoutSpec.FIT:
        break
      case LayoutSpec.JUST:
      default:
        this.TAG.height(v.height)
        break
    }

  }

  private getFlexTypedValue(value: FlexValue) {
    if (typeof value === "number") {
      return value
    } else if (typeof value === "object") {
      const flexTypedValue = value as FlexTypedValue
      switch (flexTypedValue.type) {
        case 1: // point
          return flexTypedValue.value
        case 2: // percent
          return `${flexTypedValue.value}%`
          break
      }
    }
  }

  private doAnimation(props: any) {
    const changeables = props.changeables as Array<{
      key: string,
      keyFrames: any,
      fromValue: any,
      toValue: any
    }>
    const delay = props.delay
    const duration = props.duration
    const fillMode = props.fillMode
    const id = props.id
    const repeatCount = props.repeatCount
    const repeatMode = props.repeatMode
    const timingFunction = props.timingFunction
    const type = props.type

    let ease = "ease"
    switch (timingFunction) {
      case 0:
        ease = "ease"
        break
      case 1:
        ease = "linear"
        break
      case 2:
        ease = "ease-in"
        break
      case 3:
        ease = "ease-out"
        break
      case 4:
        ease = "ease-in-out"
        break
      default:
        ease = "ease"
        break
    }

    let fill: "none" | "forwards" | "backwards" | "both" = "forwards"
    switch (fillMode) {
      case 0:
        fill = "none"
        break
      case 1:
        fill = "forwards"
        break
      case 2:
        fill = "backwards"
        break
      case 3:
        fill = "both"
        break
      default:
        fill = "forwards"
        break
    }

    let direction: "normal" | "reverse" | "alternate" | "alternate-reverse" = "normal"
    switch (repeatMode) {
      case 1:
        direction = "normal"
        break
      case 2:
        direction = "reverse"
        break
      default:
        direction = "normal"
        break
    }

    return new Promise((resolve, reject) => {
      let options: AnimatorOptions = {
        duration: duration,
        easing: ease,
        delay: delay ?? 0,
        fill: fill,
        direction: direction,
        iterations: repeatCount ?? 1,
        begin: 0.0,
        end: 1.0
      }

      const animator = Animator.create(options)

      this.context.animators.set(id, animator)

      animator.onframe = (progress: number) => {

        changeables.forEach((changeable) => {
          const frameValue = changeable.fromValue + progress * (changeable.toValue - changeable.fromValue)

          switch (type) {
            case "TranslationAnimation":
              switch (changeable.key) {
                case "translationX":
                  this.view.translationX = frameValue
                  break
                case "translationY":
                  this.view.translationY = frameValue
                  break
              }
              break
          }
        })
      }
      animator.oncancel = () => {
        this.context.animators.delete(id)
        reject("Animation cancelled")
      }
      animator.onfinish = () => {
        animator.cancel()

        this.context.animators.delete(id)

        resolve({})
      }
      animator.play()
    })
  }

  private cancelAnimation(props: any) {
    return new Promise((resolve, reject) => {
      const id = props
      const animator = this.context.animators.get(id)
      if (animator) {
        animator.cancel()
      }
    })
  }

  private clearAnimation(props: any) {
    return new Promise((resolve, reject) => {
      const id = props
      const animator = this.context.animators.get(id)
      if (animator) {
        animator.cancel()
      }
    })
  }
}
