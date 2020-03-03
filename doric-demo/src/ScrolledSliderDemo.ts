import { Group, text, gravity, Color, LayoutSpec, vlayout, hlayout, layoutConfig, scroller, Text, ViewHolder, VMPanel, ViewModel, network, loge, HLayout, stack, image, Gravity, takeNonNull, Scroller } from "doric";
import { colors } from "./utils";

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
            stars: number
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
}

class MovieVH extends ViewHolder {
    title!: Text
    gallery!: HLayout
    scrolled!: Scroller
    movieTitle!: Text
    movieYear!: Text

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
                            space: 20,
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
                space: 50,
            }).in(root)
    }

}

class MovieVM extends ViewModel<MovieModel, MovieVH>{

    onAttached() {
        network(context).get("https://douban.uieee.com/v2/movie/top250").then(ret => {
            this.updateState(state => state.doubanModel = JSON.parse(ret.data) as DoubanModel)
        })
    }
    onBind(state: MovieModel, vh: MovieVH) {
        if (state.doubanModel) {
            vh.title.text = state.doubanModel.title
            vh.gallery.children.length = 0
            state.doubanModel.subjects.slice(0, 5).forEach((e, idx) => {
                vh.gallery.addChild(stack(
                    [
                        image({
                            layoutConfig: layoutConfig().just(),
                            width: 270 / 2 * (idx == state.selectedIdx ? 1.2 : 1),
                            height: 400 / 2 * (idx == state.selectedIdx ? 1.2 : 1),
                            imageUrl: e.images.large,
                            onClick: () => {
                                this.updateState(state => state.selectedIdx = idx)
                                vh.scrolled.scrollTo(context, { x: idx * 200, y: 0 })
                            },
                        })
                    ],
                    {
                    }))
            })
            takeNonNull(state.doubanModel.subjects[state.selectedIdx])(it => {
                vh.movieTitle.text = it.title
                vh.movieYear.text = it.year
            })
        }
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
        return { selectedIdx: 0 }
    }

}