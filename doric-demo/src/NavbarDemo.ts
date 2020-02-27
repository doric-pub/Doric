import { Group, Panel, navbar, text, gravity, Color, LayoutSpec, vlayout, Gravity, hlayout, scroller, layoutConfig, image, IVLayout, modal, IText, navigator } from "doric";
import { title, label, colors } from "./utils";

const shareIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAMAAADDpiTIAAACZFBMVEUAAABEREBEREBEREBEREBEREBEREBEREBEREBEREBEREBEREBEREBEREBEREBDQ0NDQ0JCQkJCQkJDQ0JCQkJDQ0NBQUBBQUBAQEBAQEBBQUFCQkFCQkFBQUFCQkI8PDxDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NBQUE7OztDQ0NDQ0NDQ0NDQ0NERERDQ0NDQ0NCQkJCQkJCQkJDQ0NBQUFCQkJDQ0NAQD5AQEBDQ0NCQkJCQkJCQkJCQkJDQ0NEREQAAABBQUFCQkJBQUFCQkJDQ0NBQUGAgIBDQ0JDQ0NCQkJCQkJCQkJFRUVFRURBQUFCQkJCQkJCQkJDQ0JDQ0JDQ0NCQkJDQ0NDQ0FLS0dBQUFCQkJBQUEzMzNDQ0JCQkJCQkJCQkJCQkJCQkJCQkJAQD1CQkJCQkJAQEBAQD5CQkJCQkJCQkJCQkFCQkJDQ0JCQkJBQUFCQkFERENBQUBGRkRCQkJCQkI+Pj1AQDxDQ0NCQkJAQEBCQkJCQkJCQkJCQkJHR0VCQkJDQ0NCQkJDQ0JCQkJCQkJBQUFBQUFERENBQUFCQkJCQkJDQ0JDQ0NDQ0NBQUBDQ0NCQkJDQ0NCQkJBQUFCQkJCQkJCQkJCQkJAQEBDQ0NBQUFDQ0NBQUFCQkJBQUFCQkJCQkJBQUFBQUFBQUFBQUFDQ0NDQ0NCQkJAQEBDQ0NCQkJCQkFCQkJEREI9PT1CQkJAQEBCQkJDQ0FCQkJCQkBCQkIvLyxBQUFCQkJCQkJDQ0NCQkJFRUVCQkJCQkJCQkE8PDxDQ0NCQkJBQUFCQkJCQkJBQUE9PTxCQkIOEjPPAAAAy3RSTlMAAQIDBAUGBwgJCgsMDg87RPPyRfE5REM4OjdCQznwD6KxsK2sysecDV1UVV4PW3aMpquek39mHixvquDjrXMxATuT4ueZQwIgd9zkgBormvX5oDIhmPyjKRFz73oFM8jRMm72+haoshAlz9gjM+o56z02KjUb1+EXD7jCBIOL/kYZ3ZGWN/v9M7tLSsPJTLUZKHJ5yx9qba/s7iQmVleBpcPb7cTHiYhhWHgcQcU/nBwV3yg0MNoetgN59BudnxyH5k4RXHeNrKeUE9PuQWMAAA+kSURBVHja7d37n1R1HcfxM7M7y+zOLuGC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"

@Entry
class NavbarDemo extends Panel {
    build(rootView: Group): void {
        scroller(
            vlayout(
                [
                    title("Navbar Demo"),
                    label('isHidden').apply({
                        width: 200,
                        height: 50,
                        backgroundColor: colors[0],
                        textSize: 30,
                        textColor: Color.WHITE,
                        layoutConfig: layoutConfig().just(),
                        onClick: () => {
                            navbar(context).isHidden().then(e => modal(context).alert(`Navbar isHidden:${e}`)).catch(e => {
                                modal(context).alert(e)
                            })
                        }
                    } as IText),
                    label('setHidden').apply({
                        width: 200,
                        height: 50,
                        backgroundColor: colors[0],
                        textSize: 30,
                        textColor: Color.WHITE,
                        layoutConfig: layoutConfig().just(),
                        onClick: () => {
                            navbar(context).isHidden()
                                .then(e => navbar(context).setHidden(!e))
                                .catch(e => {
                                    modal(context).alert(e)
                                })
                        }
                    } as IText),
                    label('setTitle').apply({
                        width: 200,
                        height: 50,
                        backgroundColor: colors[0],
                        textSize: 30,
                        textColor: Color.WHITE,
                        layoutConfig: layoutConfig().just(),
                        onClick: () => {
                            navbar(context).setTitle('Setted Title')
                                .catch(e => {
                                    modal(context).alert(e)
                                })
                        }
                    } as IText),
                    label('setBgColor').apply({
                        width: 200,
                        height: 50,
                        backgroundColor: colors[0],
                        textSize: 30,
                        textColor: Color.WHITE,
                        layoutConfig: layoutConfig().just(),
                        onClick: () => {
                            navbar(context).setBgColor(Color.YELLOW)
                                .catch(e => {
                                    modal(context).alert(e)
                                })
                        }
                    } as IText),
                    label('setLeft').apply({
                        width: 200,
                        height: 50,
                        backgroundColor: colors[0],
                        textSize: 30,
                        textColor: Color.WHITE,
                        layoutConfig: layoutConfig().just(),
                        onClick: () => {
                            navbar(context).setLeft(text({
                                width: 70,
                                height: 44,
                                textColor: Color.BLACK,
                                layoutConfig: layoutConfig().just().configAlignment(Gravity.Center),
                                text: "Left",
                            }))
                                .catch(e => {
                                    modal(context).alert(e)
                                })
                        }
                    } as IText),
                    label('setRight').apply({
                        width: 200,
                        height: 50,
                        backgroundColor: colors[0],
                        textSize: 30,
                        textColor: Color.WHITE,
                        layoutConfig: layoutConfig().just(),
                        onClick: () => {
                            navbar(context).setRight(hlayout([
                                text({
                                    width: 70,
                                    height: 44,
                                    textColor: Color.BLACK,
                                    layoutConfig: layoutConfig().just().configAlignment(Gravity.Center),
                                    text: "Right",
                                }),
                                image({
                                    imageBase64: shareIcon
                                }).apply({
                                    layoutConfig: layoutConfig().just().configAlignment(gravity().centerY()),
                                    width: 33,
                                    height: 33,
                                    onClick: () => {
                                        modal(context).toast('Right Clicked', Gravity.Bottom)
                                    }
                                })
                            ]))
                                .catch(e => {
                                    modal(context).alert(e)
                                })
                        }
                    } as IText),
                    label('Pop').apply({
                        width: 200,
                        height: 50,
                        backgroundColor: colors[0],
                        textSize: 30,
                        textColor: Color.WHITE,
                        layoutConfig: layoutConfig().just(),
                        onClick: () => {
                            navigator(context).pop()
                        }
                    } as IText),
                ],
                {
                    layoutConfig: layoutConfig().most().configHeight(LayoutSpec.FIT),
                    gravity: gravity().center(),
                    space: 10,
                }),
            {
                layoutConfig: layoutConfig().most(),
                backgroundColor: Color.BLUE,
            }
        ).in(rootView)
    }
}