export function deepClone(nativeViewModel) {
    const ret = {
        id: nativeViewModel.id,
        type: nativeViewModel.type,
        props: Object.assign({}, nativeViewModel.props),
    };
    if (nativeViewModel.props.subviews) {
        ret.props.subviews = nativeViewModel.props.subviews
            .map(e => deepClone(e));
    }
    return ret;
}
