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
import Animator, { AnimatorOptions, AnimatorResult } from '@ohos.animator'
import { DoricContext, getGlobalObject, ViewStackProcessor } from './sandbox'
import { argbToHex } from './util'

const GradientDirection = getGlobalObject("GradientDirection")
const Visibility = getGlobalObject("Visibility")
const ItemAlign = getGlobalObject("ItemAlign")
const Color = getGlobalObject("Color")

const animatedKeys = [
  "translationX",
  "translationY",
  "scaleX",
  "scaleY",
  "rotation",
]

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
    if (v.x !== undefined) {
      marginLeft = v.x
    }

    // y
    let marginTop
    if (v.y !== undefined) {
      marginTop = v.y
    }

    if (this.isInAnimator()) {
      if (v.x !== undefined) {
        const x = parseInt(JSON.parse(JSON.parse(getInspectorByKey(v.viewId)).$attrs.margin).left.replace("vp", ""))
        this.addAnimator("x", x, v.x)
      }
      if (v.y !== undefined) {
        const y = parseInt(JSON.parse(JSON.parse(getInspectorByKey(v.viewId)).$attrs.margin).top.replace("vp", ""))
        this.addAnimator("y", y, v.y)
      }
    } else {
      this.TAG.margin({
        left: marginLeft ?? 0,
        top: marginTop ?? 0,
      })
    }

    // onClick
    if (v.onClick) {
      this.TAG.onClick(() => {
        Reflect.apply(v.onClick, v, [])
      })
    }

    // backgroundColor
    if (v.backgroundColor) {
      if (this.isInAnimator()) {
        const backgroundColor = JSON.parse(getInspectorByKey(v.viewId)).$attrs.backgroundColor
        this.addAnimator("backgroundColor", DoricColor.parse(backgroundColor), (v.backgroundColor as DoricColor))
      } else {
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
      }
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
      if (this.isInAnimator()) {
        const corners = parseInt(JSON.parse(getInspectorByKey(v.viewId)).$attrs.borderRadius.replace("vp", ""))
        this.addAnimator("corners", corners, v.corners as number)
      } else {
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

    // scaleX & scaleY
    if (v.scaleY || v.scaleX) {
      const scaleOptions = {} as any
      if (v.scaleX) {
        scaleOptions.x = v.scaleX
      }
      if (v.scaleY) {
        scaleOptions.y = v.scaleY
      }
      this.TAG.scale(scaleOptions)
    }

    // rotation
    if (v.rotation) {
      this.TAG.rotate({
        x: 0,
        y: 0,
        z: 1,
        angle: v.rotation * 180
      })
    }

    // rotationX
    if (v.rotationX) {
      this.TAG.rotate({
        x: 1,
        y: 0,
        z: 0,
        angle: v.rotationX * 180
      })
    }

    // rotationX
    if (v.rotationY) {
      this.TAG.rotate({
        x: 0,
        y: 1,
        z: 0,
        angle: v.rotationY * 180
      })
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

    if (this.isInAnimator()) {
      if (v.width) {
        const width = parseInt(JSON.parse(getInspectorByKey(v.viewId)).$attrs.width.replace("vp", ""))
        this.addAnimator("width", width, v.width)
      }
    } else {
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
    }

    if (this.isInAnimator()) {
      if (v.height) {
        const height = parseInt(JSON.parse(getInspectorByKey(v.viewId)).$attrs.height.replace("vp", ""))
        this.addAnimator("height", height, v.height)
      }
    } else {
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

  private parseAnimator(props: any) {
    const animatorSet = []
    if (props.animations) {
      const promises = []
      for (let index = 0; index < props.animations.length; index++) {
        const animation = props.animations[index];
        const promise = this.parseSingleAnimator(animation, animatorSet)
        promises.push(promise)
      }

      this.context.animators.set(props.id, animatorSet)

      return new Promise((resolve, reject) => {
        Promise.all(promises)
          .then(() => {
            const result = {}
            animatedKeys.forEach((animatedKey) => {
              result[animatedKey] = this.getAnimatedValue(animatedKey)
            })
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    } else {
      this.parseSingleAnimator(props, animatorSet)

      this.context.animators.set(props.id, animatorSet)
    }
  }

  private parseSingleAnimator(props: any, animatorSet: AnimatorResult[]) {
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

      animatorSet.push(animator)

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
            case "ScaleAnimation":
              switch (changeable.key) {
                case "scaleX":
                  this.view.scaleX = frameValue
                  break
                case "scaleY":
                  this.view.scaleY = frameValue
                  break
              }
              break
            case "RotationAnimation":
              switch (changeable.key) {
                case "rotation":
                  this.view.rotation = frameValue
                  break
              }
              break
            case "RotationXAnimation":
              switch (changeable.key) {
                case "rotationX":
                  this.view.rotationX = frameValue
                  break
              }
              break
            case "RotationYAnimation":
              switch (changeable.key) {
                case "rotationY":
                  this.view.rotationY = frameValue
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

        const result = {}
        animatedKeys.forEach((animatedKey) => {
          result[animatedKey] = this.getAnimatedValue(animatedKey)
        })
        resolve(result)
      }
      animator.play()
    })
  }

  private doAnimation(props: any) {
    return this.parseAnimator(props)
  }

  private cancelAnimation(props: any) {
    return new Promise((resolve, reject) => {
      const id = props
      const animatorSet = this.context.animators.get(id)
      if (animatorSet) {
        animatorSet.forEach((animator) => {
          animator.cancel()
        })
      }
    })
  }

  private clearAnimation(props: any) {
    return new Promise((resolve, reject) => {
      const id = props
      const animatorSet = this.context.animators.get(id)
      if (animatorSet) {
        animatorSet.forEach((animator) => {
          animator.cancel()
        })
      }
    })
  }

  private getAnimatedValue(key: string) {
    switch (key) {
      case "translationX":
        return this.view.translationX
      case "translationY":
        return this.view.translationY
      case "scaleX":
        return this.view.scaleX
      case "scaleY":
        return this.view.scaleY
      case "rotation":
        return this.view.rotation
      default:
        return 0
    }
  }

  private isInAnimator() {
    return this.context.getAnimatorSet() != null
  }

  public addAnimator(key: string, fromValue: number | DoricColor, toValue: number | DoricColor) {
    if (this.context.getAnimatorSet() == null) {
      return
    }
    let options: AnimatorOptions = {
      duration: this.context.getAnimatorSet().duration,
      easing: "ease",
      delay: 0,
      fill: "forwards",
      direction: "normal",
      iterations: 1,
      begin: 0.0,
      end: 1.0
    }

    const animator = Animator.create(options)
    animator.onframe = (progress: number) => {
      if (key !== "backgroundColor") {
        const frameValue = (fromValue as number) + progress * ((toValue as number) - (fromValue as number))
        switch (key) {
          case "width":
            this.view.width = frameValue
            break
          case "height":
            this.view.height = frameValue
            break
          case "x":
            this.view.x = frameValue
            break
          case "y":
            this.view.y = frameValue
            break
          case "corners":
            this.view.corners = frameValue
            break
        }
      } else {
        let from = (fromValue as DoricColor)._value
        from >>>= 0
        const fromB = from & 0xFF,
          fromG = (from & 0xFF00) >>> 8,
          fromR = (from & 0xFF0000) >>> 16,
          fromA = ((from & 0xFF000000) >>> 24)

        let to = (toValue as DoricColor)._value
        to >>>= 0
        const toB = to & 0xFF,
          toG = (to & 0xFF00) >>> 8,
          toR = (to & 0xFF0000) >>> 16,
          toA = ((to & 0xFF000000) >>> 24)

        const frameA = Math.round(fromA + progress * (toA - fromA))
        const frameR = Math.round(fromR + progress * (toR - fromR))
        const frameG = Math.round(fromG + progress * (toG - fromG))
        const frameB = Math.round(fromB + progress * (toB - fromB))

        const frameColor = argbToHex(frameA, frameR, frameG, frameB)
        this.view.backgroundColor = DoricColor.parse(frameColor)
      }
    }
    animator.oncancel = () => {
    }
    animator.onfinish = () => {
      animator.cancel()
    }
    animator.play()
    this.context.getAnimatorSet().animatorSet.push(animator)
  }
}
