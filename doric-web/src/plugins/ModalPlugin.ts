import { DoricPlugin } from '../DoricPlugin'
import { TOP, CENTER_Y, BOTTOM, toPixelString } from '../shader/DoricViewNode'

export class ModalPlugin extends DoricPlugin {
    toast(args: {
        msg?: string,
        gravity?: number
    }) {
        const toastElement = document.createElement('div')
        toastElement.style.position = "absolute"
        toastElement.style.textAlign = "center"
        toastElement.style.width = "100%"

        const textElement = document.createElement('span')
        textElement.innerText = args.msg || ""
        textElement.style.backgroundColor = "#777777"
        textElement.style.color = "white"
        textElement.style.paddingLeft = '20px'
        textElement.style.paddingRight = '20px'
        textElement.style.paddingTop = '10px'
        textElement.style.paddingBottom = '10px'
        toastElement.appendChild(textElement)
        document.body.appendChild(toastElement)
        const gravity = args.gravity || BOTTOM
        if ((gravity & TOP) == TOP) {
            toastElement.style.top = toPixelString(30)
        } else if ((gravity & BOTTOM) == BOTTOM) {
            toastElement.style.bottom = toPixelString(30)
        } else if ((gravity & CENTER_Y) == CENTER_Y) {
            toastElement.style.top = toPixelString(document.body.offsetHeight / 2 - toastElement.offsetHeight / 2)
        }
        setTimeout(() => {
            document.body.removeChild(toastElement)
        }, 2000)
        return Promise.resolve()
    }
    alert(args: {
        title?: string,
        msg?: string,
        okLabel?: string,
    }) {
        window.alert(args.msg || "")
        return Promise.resolve()
    }
    confirm(args: {
        title?: string,
        msg?: string,
        okLabel?: string,
        cancelLabel?: string,
    }) {
        if (window.confirm(args.msg || "")) {
            return Promise.resolve()
        } else {
            return Promise.reject()
        }
    }
    prompt(args: {
        title?: string,
        msg?: string,
        okLabel?: string,
        cancelLabel?: string,
        defaultText?: string
        text?: string
    }) {
        const result = window.prompt(args.msg || "", args.defaultText)
        if (result) {
            return Promise.resolve(result)
        } else {
            return Promise.reject(result)
        }
    }
}