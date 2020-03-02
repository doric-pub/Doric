import { Group, text, gravity, Color, LayoutSpec, vlayout, hlayout, layoutConfig, scroller, Text, ViewHolder, VMPanel, ViewModel, network, loge, HLayout, stack, image } from "doric";
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
}

class MovieVH extends ViewHolder {
    title!: Text
    gallery!: HLayout

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
                scroller(
                    this.gallery = hlayout(
                        [],
                        {
                            layoutConfig: layoutConfig().most().configWidth(LayoutSpec.FIT),
                            space: 100,
                        }),
                    {
                        layoutConfig: layoutConfig().most().configHeight(LayoutSpec.JUST),
                        height: 200,
                        backgroundColor: Color.parse("#eeeeee"),
                    })
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
            state.doubanModel.subjects.slice(0, 5).forEach(e => {
                vh.gallery.addChild(stack(
                    [
                        image({
                            layoutConfig: layoutConfig().just(),
                            width: 100,
                            height: 100,
                            imageUrl: e.images.large
                        })
                    ],
                    {
                        backgroundColor: Color.YELLOW,
                    }))
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
        return {}
    }

}