import { Group, text, gravity, Color, LayoutSpec, vlayout, hlayout, layoutConfig, scroller, Text, ViewHolder, VMPanel, ViewModel, network, loge, HLayout, stack, image, Gravity, takeNonNull, Scroller, Image, View } from "doric";
import { colors } from "./utils";
import MovieData from './movie.json'

interface DoubanModel {
    count: number
    start: number
    total: number
    subjects: Array<{
        rating: {
            max: number,
            average: number,
            details: {
                "1": number,
                "2": number,
                "3": number,
                "4": number,
                "5": number,
            },
            stars: string
            min: number,
        }
        genres: string[],
        title: string
        casts: Array<{
            avatars: {
                small: string,
                large: string,
                medium: string,
            },
            name_en: string
            name: string
            alt: string
            id: string
        }>
        durations: string[]
        collect_count: number
        mainland_pubdate: string
        has_video: boolean
        original_title: string
        subtype: string
        directors: Array<{
            avatars: {
                small: string,
                large: string,
                medium: string,
            },
            name_en: string
            name: string
            alt: string
            id: string
        }>,
        pubdates: string[],

        year: string,
        images: {
            small: string,
            large: string,
            medium: string,
        }
        alt: string
        id: string
    }>
    title: string
}

interface MovieModel {
    doubanModel?: DoubanModel
    selectedIdx: number
    anchorPos: number
}

const frameWidth = 200
const frameHeight = 300
const padding = 20

class MovieVH extends ViewHolder {
    title!: Text
    gallery!: HLayout
    scrolled!: Scroller
    movieTitle!: Text
    movieYear!: Text
    anchor!: View
    build(root: Group) {
        vlayout(
            [
                this.title = text({
                    layoutConfig: {
                        widthSpec: LayoutSpec.MOST,
                        heightSpec: LayoutSpec.JUST,
                    },
                    textSize: 30,
                    textColor: Color.WHITE,
                    backgroundColor: colors[1],
                    textAlignment: gravity().center(),
                    height: 50,
                }),
                this.scrolled = scroller(
                    this.gallery = hlayout(
                        [],
                        {
                            layoutConfig: layoutConfig().fit(),
                            space: 0,
                            padding: {
                                top: 20,
                                left: 20,
                                right: 20,
                                bottom: 20,
                            },
                            gravity: Gravity.Center,
                        }),
                    {
                        layoutConfig: layoutConfig().most().configHeight(LayoutSpec.FIT),
                        backgroundColor: Color.parse("#eeeeee"),
                    }),
                vlayout(
                    [
                        stack(
                            [
                                this.anchor = image({
                                    imageBase64: "data:image/png;base64,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",
                                    layoutConfig: layoutConfig().just(),
                                    width: 30,
                                    height: 30,
                                }),
                            ],
                            {
                                layoutConfig: layoutConfig().fit().configWidth(LayoutSpec.MOST),
                            }
                        ),

                        this.movieTitle = text({
                            textSize: 20,
                        }),
                        this.movieYear = text({
                            textSize: 20,
                        }),
                    ],
                    {
                        layoutConfig: layoutConfig().fit().configWidth(LayoutSpec.MOST),
                        gravity: Gravity.Center
                    }),
            ],
            {
                layoutConfig: layoutConfig().most(),
                space: 0,
            }).in(root)
    }

}

class MovieVM extends ViewModel<MovieModel, MovieVH>{
    images: Map<number, Image> = new Map

    onAttached(state: MovieModel, vh: MovieVH) {
        network(context).get("https://douban.uieee.com/v2/movie/top250").then(ret => {
            this.updateState(state => state.doubanModel = JSON.parse(ret.data) as DoubanModel)
        })
        this.updateState(state => {
            state.anchorPos = padding + frameWidth / 2
            state.selectedIdx = 0
        })
        let scrollX = 0
        vh.scrolled.onScroll = (offset) => {
            if (offset.x < 0 || offset.x > (state.doubanModel?.count || 0) * frameWidth + padding * 2 - Environment.screenWidth) {
                return
            }
            const dx = offset.x - scrollX
            scrollX = offset.x
            const idx = Math.floor((offset.x + state.anchorPos - padding) / frameWidth)
            if (state.selectedIdx !== idx) {
                this.updateState(state => state.selectedIdx = idx)
            }
            takeNonNull(this.images.get(idx))(it => {
                const scale = (offset.x + state.anchorPos - (idx + 0.5) * frameWidth - padding) / (frameWidth / 2)
                it.scaleX = it.scaleY = 1.5 - Math.abs(scale * 0.5)
            })
            this.updateArrow()
        }
    }

    updateArrow() {
        takeNonNull(this.images.get(this.getState().selectedIdx))(it => {
            it.getLocationOnScreen(context).then(ret => {
                this.getViewHolder().anchor.centerX = ret.x + frameWidth / 2
            })
        })
    }

    onItemClicked(idx: number) {
        takeNonNull(this.images.get(this.getState().selectedIdx)?.superview)(it => {
            it.scaleX = it.scaleY = 1
        })
        takeNonNull(this.images.get(idx)?.superview)(it => {
            it.getLocationOnScreen(context).then(ret => {
                let anchor = this.getState().anchorPos
                if (ret.x < 0) {
                    this.getViewHolder().scrolled.scrollBy(context, { x: ret.x, y: 0 }, true)
                    anchor = frameWidth / 2
                } else if (ret.x > Environment.screenWidth - frameWidth) {
                    this.getViewHolder().scrolled.scrollBy(
                        context,
                        { x: ret.x - (Environment.screenWidth - frameWidth), y: 0 },
                        true)
                    anchor = Environment.screenWidth - frameWidth / 2
                } else {
                    anchor = ret.x + frameWidth / 2
                }
                this.updateState(state => {
                    state.selectedIdx = idx
                    state.anchorPos = anchor
                })
            })
        })
    }

    onBind(state: MovieModel, vh: MovieVH) {
        if (state.doubanModel) {
            vh.title.text = state.doubanModel.title
            vh.gallery.children.length = 0
            const vm = this
            state.doubanModel.subjects.forEach((e, idx) => {
                vh.gallery.addChild(stack(
                    [
                        image({
                            layoutConfig: layoutConfig().just().configAlignment(Gravity.Center),
                            width: frameWidth / 1.5,
                            height: frameHeight / 1.5,
                            imageUrl: e.images.large,
                            onClick: function () {
                                const v = (this as Image).superview
                                if (v == undefined) {
                                    return
                                }
                                vm.onItemClicked(idx)
                            },
                        }).also(it => {
                            this.images.set(idx, it)
                            if (state.selectedIdx == idx) {
                                it.scaleX = it.scaleY = 1.5
                            }
                        })
                    ],
                    {
                        layoutConfig: layoutConfig().just(),
                        width: frameWidth,
                        height: frameHeight,
                    }))
            })
            takeNonNull(state.doubanModel.subjects[state.selectedIdx])(it => {
                vh.movieTitle.text = it.title
                vh.movieYear.text = it.year
            })
        }
        vh.anchor.centerX = state.anchorPos
        this.updateArrow()
    }
}

@Entry
class SliderPanel extends VMPanel<MovieModel, MovieVH>{
    getViewModelClass() {
        return MovieVM
    }
    getViewHolderClass() {
        return MovieVH
    }

    getState() {
        return { selectedIdx: 0, anchorPos: Environment.screenWidth / 2, doubanModel: MovieData }
    }

}