import { NativeViewModel } from "../ui/view";

export function deepClone(nativeViewModel: NativeViewModel) {
    const ret = {
        id: nativeViewModel.id,
        type: nativeViewModel.type,
        props: {
            ...nativeViewModel.props
        },
    }
    if (nativeViewModel.props.subviews) {
        ret.props.subviews = (nativeViewModel.props.subviews as NativeViewModel[])
            .map(e => deepClone(e));
    }
    return ret;
}