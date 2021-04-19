import { Group, Panel, stack, Color, LayoutSpec, layoutConfig } from "doric";

@Entry
class SimpleDemo extends Panel {
    build(rootView: Group) {
        stack([
            stack([
                stack(
                    [],
                    {
                        layoutConfig: layoutConfig().just().configWidth(LayoutSpec.MOST),
                        height: 50,
                        backgroundColor: Color.RED
                    }
                )
            ])
        ]).in(rootView)
    }
}