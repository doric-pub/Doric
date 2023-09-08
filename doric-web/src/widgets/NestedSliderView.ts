function getX(ev: MouseEvent | TouchEvent) {
    return ev instanceof MouseEvent ? ev.pageX : ev.touches[0].pageX
}

function getY(ev: MouseEvent | TouchEvent) {
    return ev instanceof MouseEvent ? ev.pageY : ev.touches[0].pageY

}

type Props = {
    scrollable: () => boolean,
    onPageSelected?: (index: number) => void
}


export function NestedSliderView(props: Props) {
    const ret = document.createElement("div");
    ret.style.overflow = "hidden";
    ret.style.display = "inline";
    ret.style.whiteSpace = "nowrap";
    let touch = {
        touchStartX: 0,
        touchStartY: 0,
        currentIndex: 0,
        isDragging: false,
        horizontal: true
    }
    ret.ontouchstart = ret.onmousedown = (ev: MouseEvent | TouchEvent) => {
        if (!props.scrollable()) return;
        touch = {
            ...touch,
            currentIndex: Math.round(ret.scrollLeft / ret.offsetWidth),
            touchStartX: getX(ev),
            touchStartY: getY(ev),
            isDragging: true
        }
    };
    ret.ontouchmove = ret.onmousemove = (ev: MouseEvent | TouchEvent) => {
        if (!props.scrollable() || !touch.isDragging) return;
        if (!touch.horizontal) {
            return
        }
        if (Math.abs(getX(ev) - touch.touchStartX) < Math.abs(getY(ev) - touch.touchStartY)) {
            touch.horizontal = false
            return
        }
        const offsetX = (touch.touchStartX - getX(ev)) * 1.2;
        ret.scrollTo({
            left: touch.currentIndex * ret.offsetWidth + offsetX,
        });
    };
    ret.onmouseup = ret.ontouchcancel = ret.ontouchend = () => {
        if (!props.scrollable()) return;
        touch = {
            ...touch,
            isDragging: false,
            horizontal: true,
        }
        let originIndex = touch.currentIndex;
        if (Math.abs(ret.scrollLeft - originIndex * ret.offsetWidth) > ret.offsetWidth / 5) {
            const positionOffset = Math.abs(ret.scrollLeft) > originIndex * ret.offsetWidth ? 1 : -1;
            touch.currentIndex += positionOffset;
        }
        ret.scrollTo({
            left: touch.currentIndex * ret.offsetWidth,
            behavior: "smooth",
        });
        if (originIndex !== touch.currentIndex) {
            if (props.onPageSelected) {
                props.onPageSelected(touch.currentIndex)
            }
        }
    };
    return ret
}