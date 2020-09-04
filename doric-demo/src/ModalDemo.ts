import { Group, Panel, text, Color, LayoutSpec, vlayout, Gravity, scroller, layoutConfig, modal, Text } from "doric";
import { colors, label } from "./utils";

@Entry
export class ModalDemo extends Panel {
    build(rootView: Group): void {
        scroller(
            vlayout(
                [
                    text({
                        text: "Modal",
                        layoutConfig: layoutConfig().configWidth(LayoutSpec.MOST),
                        textSize: 30,
                        textColor: Color.WHITE,
                        backgroundColor: colors[1],
                        textAlignment: Gravity.Center,
                        height: 50,
                    }),
                    label('toast on bottom'),
                    label('Click me').apply({
                        width: 200,
                        height: 50,
                        backgroundColor: colors[0],
                        textSize: 30,
                        textColor: Color.WHITE,
                        layoutConfig: layoutConfig().just(),
                        onClick: () => {
                            modal(context).toast('This is a toast.')
                        }
                    }),
                    label('toast on top'),
                    label('Click me').apply({
                        width: 200,
                        height: 50,
                        backgroundColor: colors[0],
                        textSize: 30,
                        textColor: Color.WHITE,
                        layoutConfig: layoutConfig().just(),
                        onClick: () => {
                            modal(context).toast('This is a toast.', Gravity.Top)
                        }
                    }),

                    label('toast on center'),
                    label('Click me').apply({
                        width: 200,
                        height: 50,
                        backgroundColor: colors[0],
                        textSize: 30,
                        textColor: Color.WHITE,
                        layoutConfig: layoutConfig().just(),
                        onClick: () => {
                            modal(context).toast('This is a toast.', Gravity.Center)
                        }
                    } as Partial<Text>),
                    text({
                        text: "Alert",
                        layoutConfig: layoutConfig().configWidth(LayoutSpec.MOST),
                        textSize: 30,
                        textColor: Color.WHITE,
                        backgroundColor: colors[2],
                        textAlignment: Gravity.Center,
                        height: 50,
                    }),
                    label('Click me').apply({
                        width: 200,
                        height: 50,
                        backgroundColor: colors[0],
                        textSize: 30,
                        textColor: Color.WHITE,
                        layoutConfig: layoutConfig().just(),
                        onClick: () => {
                            modal(context).alert({
                                msg: 'This is alert.',
                                title: 'Alert title',
                                okLabel: "OkLabel"
                            }).then(e => {
                                modal(context).toast('Clicked OK.')
                            })
                        }
                    }),
                    text({
                        text: "Confirm",
                        layoutConfig: layoutConfig().configWidth(LayoutSpec.MOST),
                        textSize: 30,
                        textColor: Color.WHITE,
                        backgroundColor: colors[3],
                        textAlignment: Gravity.Center,
                        height: 50,
                    }),
                    label('Click me').apply({
                        width: 200,
                        height: 50,
                        backgroundColor: colors[0],
                        textSize: 30,
                        textColor: Color.WHITE,
                        layoutConfig: layoutConfig().just(),
                        onClick: () => {
                            modal(context).confirm({
                                msg: 'This is Confirm.',
                                title: 'Confirm title',
                                okLabel: "OkLabel",
                                cancelLabel: 'CancelLabel',
                            }).then(
                                () => {
                                    modal(context).toast('Clicked OK.')
                                },
                                () => {
                                    modal(context).toast('Clicked Cancel.')
                                })
                        }
                    }),
                    text({
                        text: "Prompt",
                        layoutConfig: layoutConfig().configWidth(LayoutSpec.MOST),
                        textSize: 30,
                        textColor: Color.WHITE,
                        backgroundColor: colors[4],
                        textAlignment: Gravity.Center,
                        height: 50,
                    }),
                    label('Click me').apply({
                        width: 200,
                        height: 50,
                        backgroundColor: colors[0],
                        textSize: 30,
                        textColor: Color.WHITE,
                        layoutConfig: layoutConfig().just(),
                        onClick: () => {
                            modal(context).prompt({
                                msg: 'This is Prompt.',
                                title: 'Prompt title',
                                okLabel: "OkLabel",
                                cancelLabel: 'CancelLabel',
                            }).then(
                                e => {
                                    modal(context).toast(`Clicked OK.Input:${e}`)
                                },
                                e => {
                                    modal(context).toast(`Clicked Cancel.Input:${e}`)
                                })
                        }
                    }),
                ],
                {
                    layoutConfig: layoutConfig().most().configHeight(LayoutSpec.FIT),
                    gravity: Gravity.Center,
                    space: 10,
                }
            ),
            {
                layoutConfig: layoutConfig().most(),
            }
        ).in(rootView)
    }
}