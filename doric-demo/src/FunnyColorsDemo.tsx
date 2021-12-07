import {
  Group,
  layoutConfig,
  Panel,
  VMPanel,
  LayoutSpec,
  Color,
  gravity,
  jsx,
  Text,
  VLayout,
  List,
  ViewHolder,
  ViewModel,
  createRef,
  ListItem,
  Gravity,
  HLayout,
  Stack,
  popover,
  animate,
  Image,
} from "doric";

interface ColorsModel {
  colors: {
    color: Color;
    name: string;
    description?: string;
    imageUrl?: string;
  }[];
}

class ColorsVH extends ViewHolder {
  list = createRef<List>();
  build(root: Group) {
    <VLayout parent={root} layoutConfig={layoutConfig().most()}>
      <Text
        parent={root}
        layoutConfig={layoutConfig().configWidth(LayoutSpec.MOST)}
        textSize={30}
        textAlignment={gravity().center()}
        height={50}
      >
        有趣的颜色
      </Text>
      <List
        ref={this.list}
        layoutConfig={layoutConfig().mostWidth().justHeight().configWeight(1)}
      />
    </VLayout>;
  }
}

class ColorsVM extends ViewModel<ColorsModel, ColorsVH> {
  onAttached(state: ColorsModel, vh: ColorsVH) {
    vh.list.current.apply({
      renderItem: (idx) => {
        const descRef = createRef<HLayout>();
        return (
          <ListItem
            layoutConfig={layoutConfig().mostWidth().justHeight()}
            backgroundColor={state.colors[idx].color}
            height={100}
            padding={{ left: 20, right: 20 }}
            alpha={1}
            onClick={async () => {
              const popedView = createRef<Stack>();
              const descLayout = createRef<HLayout>();
              const imageRef = createRef<Image>();
              const position = await descRef.current.getLocationOnScreen(
                this.context
              );
              const rootPosition = await (this.context.entity as Panel)
                .getRootView()
                .getLocationOnScreen(this.context);
              const offsetX = position.x + rootPosition.x;
              const offsetY = position.y - rootPosition.y;

              await popover(this.context).show(
                <Stack
                  ref={popedView}
                  layoutConfig={layoutConfig().most()}
                  onClick={async () => {
                    await animate(this.context)({
                      duration: 500,
                      animations: () => {
                        popedView.current.alpha = 0;
                        descLayout.current.y = offsetY;
                      },
                    });
                    popover(this.context).dismiss();
                  }}
                  alpha={0}
                  backgroundColor={state.colors[idx].color}
                >
                  <VLayout
                    layoutConfig={layoutConfig().mostWidth().fitHeight()}
                  >
                    <HLayout
                      ref={descLayout}
                      left={offsetX}
                      top={offsetY}
                      layoutConfig={layoutConfig().mostWidth().fitHeight()}
                      gravity={Gravity.CenterY.left()}
                      space={20}
                      padding={{ right: 20 }}
                    >
                      <Stack
                        backgroundColor={Color.WHITE}
                        layoutConfig={layoutConfig().justWidth().mostHeight()}
                        width={4}
                      />
                      <VLayout space={5}>
                        <Text
                          textSize={30}
                          textColor={Color.WHITE}
                          textAlignment={Gravity.CenterY.left()}
                        >
                          {state.colors[idx].name}
                        </Text>
                        <Text
                          textSize={16}
                          textColor={Color.WHITE}
                          maxLines={-1}
                          hidden={!!!state.colors[idx].description}
                          textAlignment={Gravity.CenterY.left()}
                        >
                          {state.colors[idx].description}
                        </Text>
                      </VLayout>
                    </HLayout>
                    <Image
                      ref={imageRef}
                      layoutConfig={layoutConfig().mostWidth().fitHeight()}
                      imageUrl={state.colors[idx].imageUrl}
                      alpha={0}
                    ></Image>
                  </VLayout>
                </Stack>
              );
              popedView.current.alpha = 1;
              await animate(this.context)({
                duration: 500,
                animations: () => {
                  popedView.current.alpha = 1;
                  descLayout.current.y = 50;
                },
              });
              await animate(this.context)({
                duration: 500,
                animations: () => {
                  imageRef.current.alpha = 1;
                },
              });
            }}
          >
            <HLayout
              ref={descRef}
              layoutConfig={layoutConfig()
                .mostWidth()
                .fitHeight()
                .configAlignment(Gravity.Center)}
              gravity={Gravity.CenterY.left()}
              space={20}
            >
              <Stack
                backgroundColor={Color.WHITE}
                layoutConfig={layoutConfig().justWidth().mostHeight()}
                width={4}
              />
              <VLayout space={5}>
                <Text
                  textSize={30}
                  textColor={Color.WHITE}
                  textAlignment={Gravity.CenterY.left()}
                >
                  {state.colors[idx].name}
                </Text>
                <Text
                  textSize={16}
                  maxLines={-1}
                  textColor={Color.WHITE}
                  hidden={!!!state.colors[idx].description}
                  textAlignment={Gravity.CenterY.left()}
                >
                  {state.colors[idx].description}
                </Text>
              </VLayout>
            </HLayout>
          </ListItem>
        ) as ListItem;
      },
    });
  }
  onBind(state: ColorsModel, vh: ColorsVH) {
    vh.list.current.apply({
      itemCount: state.colors.length,
    });
  }
}

function rgb(r: number, g: number, b: number) {
  return new Color((r << 16) + (g << 8) + b + 0xff000000);
}

@Entry
export class FunnyColors extends VMPanel<ColorsModel, ColorsVH> {
  getViewModelClass() {
    return ColorsVM;
  }
  getState() {
    return {
      colors: [
        {
          color: rgb(76, 0, 9),
          name: "波尔多红",
          description: "深樱桃红,因法国波尔多红酒得名",
        },
        {
          color: rgb(0, 49, 83),
          name: "普鲁士蓝",
          description: "又称 “柏林蓝”",
        },
        {
          color: rgb(128, 0, 32),
          name: "勃艮第红",
          description: "因法国出产的勃艮第酒颜色而得名",
        },
        {
          color: rgb(0, 149, 182),
          name: "邦迪蓝",
          description: "源自澳大利亚邦迪海滩",
        },
        {
          color: rgb(143, 75, 40),
          name: "木乃伊棕",
          description: "从古老的木乃伊中提炼出的颜色",
        },
        {
          color: rgb(26, 85, 153),
          name: "卡布里蓝",
          description: "来自意大利卡布里岛的蓝洞湖水色",
        },
        {
          color: rgb(176, 89, 35),
          name: "提香红",
          description: "来自于精彩描绘金红发的画家提香",
        },
        {
          color: rgb(129, 216, 208),
          name: "蒂凡尼蓝",
          description: "纽约珠宝公司蒂芙尼所拥有的颜色俗称, 为较浅的知更鸟淡蓝",
        },
        {
          color: rgb(158, 46, 36),
          name: "覆盆子红",
          imageUrl:
            "https://pica.zhimg.com/80/v2-972e907fee9f990b637f3d4e1622c50a_720w.jpg?source=1940ef5c",
        },
        {
          color: rgb(226, 175, 66),
          name: "虎皮黄",
          imageUrl:
            "https://pic3.zhimg.com/80/v2-4839404bda1774a272d7517eaaf894e1_720w.jpg?source=1940ef5c",
        },
        {
          color: rgb(64, 125, 82),
          name: "薄荷绿",
          imageUrl:
            "https://pica.zhimg.com/80/v2-805684e47d49dcc9d846abd84f229d69_720w.jpg?source=1940ef5c",
        },
        {
          color: rgb(207, 182, 74),
          name: "草黄",
          imageUrl:
            "https://pic1.zhimg.com/80/v2-2dfa7bfac90205c17a8efc89daa1ce89_720w.jpg?source=1940ef5c",
        },
        {
          color: rgb(154, 180, 205),
          name: "星蓝",
          imageUrl:
            "https://pic3.zhimg.com/80/v2-523760352171e05fcc36df97b3570061_720w.jpg?source=1940ef5c",
        },
        {
          color: rgb(65, 138, 180),
          name: "鸢尾蓝",
          imageUrl:
            "https://pic1.zhimg.com/80/v2-57c9b41f1d5fb4cef6d4dbf60ff149de_720w.jpg?source=1940ef5c",
        },
        {
          color: rgb(142, 41, 97),
          name: "苋菜紫",
          imageUrl:
            "https://pic3.zhimg.com/80/v2-10207175a72cfe149fe4362f295dd7d6_720w.jpg?source=1940ef5c",
        },
        {
          color: rgb(16, 20, 32),
          name: "钢蓝",
          imageUrl:
            "https://pic1.zhimg.com/80/v2-05068fce3176c3c8fd01a7aa96634842_720w.jpg?source=1940ef5c",
        },
        {
          color: rgb(218, 227, 230),
          name: "云峰白",
          imageUrl:
            "https://pica.zhimg.com/80/v2-786a9d8ebaa73d4e48d8ddfbecf6fded_720w.jpg?source=1940ef5c",
        },
        {
          color: rgb(140, 80, 44),
          name: "岩石棕",
          imageUrl:
            "https://pic1.zhimg.com/80/v2-22b8d1d13f5a63aac70ed0e5f6b13b0d_720w.jpg?source=1940ef5c",
        },
        {
          color: rgb(184, 206, 142),
          name: "橄榄石绿",
          imageUrl:
            "https://pic2.zhimg.com/80/v2-a9df63bcfc76ba6548e6994adafcaec2_720w.jpg?source=1940ef5c",
        },
        {
          color: rgb(79, 164, 133),
          name: "竹绿",
          imageUrl:
            "https://pic1.zhimg.com/80/v2-608dd7ec8f0dc9129741987e32ced732_720w.jpg?source=1940ef5c",
        },
        {
          color: rgb(70, 146, 185),
          name: "钴蓝",
          imageUrl:
            "https://pic1.zhimg.com/80/v2-eb0280e893337d76d4491e8980a36e27_720w.jpg?source=1940ef5c",
        },
        {
          color: rgb(194, 196, 195),
          name: "月影白",
          imageUrl:
            "https://pic1.zhimg.com/80/v2-e7d3999963ee8c6d99d2817d927e2b4e_720w.jpg?source=1940ef5c",
        },
        {
          color: rgb(107, 51, 26),
          name: "笋皮棕",
          imageUrl:
            "https://pica.zhimg.com/80/v2-12619e9d73411ab0c2c434d5f99e14db_720w.jpg?source=1940ef5c",
        },
      ],
    };
  }
  getViewHolderClass() {
    return ColorsVH;
  }
}
