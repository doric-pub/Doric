import {
  Panel,
  Group,
  jsx,
  VLayout,
  layoutConfig,
  Scroller,
  Color,
  HLayout,
  Text,
  Gravity,
  Stack,
  createRef,
  ViewHolder,
  ViewModel,
  VMPanel,
  modal,
} from "doric";
import { SeekBar } from "./components/SeekBar";
import { colors } from "./utils";

interface ColorModel {
  color: number;
}

class ColorVH extends ViewHolder {
  colorRef = createRef<Stack>();
  colorLabelRef = createRef<Text>();
  rSeekBar = createRef<SeekBar>();
  gSeekBar = createRef<SeekBar>();
  bSeekBar = createRef<SeekBar>();
  aSeekBar = createRef<SeekBar>();

  build(root: Group) {
    <Scroller parent={root} layoutConfig={layoutConfig().most()}>
      <VLayout layoutConfig={layoutConfig().mostWidth().fitHeight()} space={10}>
        <Stack
          ref={this.colorRef}
          layoutConfig={layoutConfig().just().configAlignment(Gravity.Center)}
          width={100}
          height={100}
        ></Stack>
        <Text
          textSize={16}
          layoutConfig={layoutConfig().fit().configAlignment(Gravity.Center)}
          ref={this.colorLabelRef}
        ></Text>
        <HLayout
          layoutConfig={layoutConfig().mostWidth().fitHeight()}
          space={10}
          gravity={Gravity.Center}
          padding={{ left: 10, right: 10 }}
        >
          <Text
            layoutConfig={layoutConfig().justWidth().justHeight()}
            width={50}
            height={30}
            textSize={20}
            textColor={Color.WHITE}
            backgroundColor={Color.RED}
          >
            R
          </Text>
          <SeekBar
            ref={this.rSeekBar}
            layoutConfig={layoutConfig().mostWidth().justHeight()}
            height={30}
            backgroundColor={colors[3].alpha(0.3)}
            contentColor={colors[1]}
          ></SeekBar>
        </HLayout>
        <HLayout
          layoutConfig={layoutConfig().mostWidth().fitHeight()}
          space={10}
          gravity={Gravity.Center}
          padding={{ left: 10, right: 10 }}
        >
          <Text
            layoutConfig={layoutConfig().justWidth().justHeight()}
            width={50}
            height={30}
            textSize={20}
            textColor={Color.WHITE}
            backgroundColor={Color.GREEN}
          >
            G
          </Text>
          <SeekBar
            ref={this.gSeekBar}
            layoutConfig={layoutConfig().mostWidth().justHeight()}
            height={30}
            backgroundColor={colors[3].alpha(0.3)}
            contentColor={colors[1]}
          ></SeekBar>
        </HLayout>
        <HLayout
          layoutConfig={layoutConfig().mostWidth().fitHeight()}
          space={10}
          gravity={Gravity.Center}
          padding={{ left: 10, right: 10 }}
        >
          <Text
            layoutConfig={layoutConfig().justWidth().justHeight()}
            width={50}
            height={30}
            textSize={20}
            textColor={Color.WHITE}
            backgroundColor={Color.BLUE}
          >
            B
          </Text>
          <SeekBar
            ref={this.bSeekBar}
            layoutConfig={layoutConfig().mostWidth().justHeight()}
            height={30}
            backgroundColor={colors[3].alpha(0.3)}
            contentColor={colors[1]}
          ></SeekBar>
        </HLayout>
        <HLayout
          layoutConfig={layoutConfig().mostWidth().fitHeight()}
          space={10}
          gravity={Gravity.Center}
          padding={{ left: 10, right: 10 }}
        >
          <Text
            layoutConfig={layoutConfig().justWidth().justHeight()}
            width={50}
            height={30}
            textSize={20}
            textColor={Color.WHITE}
            backgroundColor={Color.GRAY}
          >
            A
          </Text>
          <SeekBar
            ref={this.aSeekBar}
            layoutConfig={layoutConfig().mostWidth().justHeight()}
            height={30}
            backgroundColor={colors[3].alpha(0.3)}
            contentColor={colors[1]}
          ></SeekBar>
        </HLayout>
      </VLayout>
    </Scroller>;
  }
}

class ColorVM extends ViewModel<ColorModel, ColorVH> {
  onAttached(state: ColorModel, vh: ColorVH) {
    vh.rSeekBar.current.apply({
      context: this.context,
      onProgressChanged: (progress: number) => {
        this.updateState((state) => {
          state.color =
            (state.color & 0xff00ffff) +
            ((Math.round(progress * 0xff) & 0xff) << 16);
        });
      },
    });
    vh.gSeekBar.current.apply({
      context: this.context,
      onProgressChanged: (progress: number) => {
        this.updateState((state) => {
          state.color =
            (state.color & 0xffff00ff) +
            ((Math.round(progress * 0xff) & 0xff) << 8);
        });
      },
    });
    vh.bSeekBar.current.apply({
      context: this.context,
      onProgressChanged: (progress: number) => {
        this.updateState((state) => {
          state.color =
            (state.color & 0xffffff00) + (Math.round(progress * 0xff) & 0xff);
        });
      },
    });
    vh.aSeekBar.current.apply({
      context: this.context,
      onProgressChanged: (progress: number) => {
        this.updateState((state) => {
          state.color =
            (state.color & 0x00ffffff) +
            ((Math.round(progress * 0xff) & 0xff) << 24);
        });
      },
    });
    vh.colorLabelRef.current.apply({
      onClick: async () => {
        const color = await modal(this.context).prompt({
          title: "Please input color",
        });
        this.updateState((state) => {
          state.color = parseInt(color, 16);
        });
      },
    });
  }
  onBind(state: ColorModel, vh: ColorVH) {
    const color = state.color;
    const a = (color >> 24) & 0xff;
    const r = (color >> 16) & 0xff;

    const g = (color >> 8) & 0xff;

    const b = color & 0xff;
    vh.colorRef.current.backgroundColor = new Color(color);
    vh.colorLabelRef.current.text = `${a.toString(16)}${r.toString(
      16
    )}${g.toString(16)}${b.toString(16)}`.toLocaleUpperCase();
    vh.rSeekBar.current.progress = r / 0xff;
    vh.gSeekBar.current.progress = g / 0xff;
    vh.bSeekBar.current.progress = b / 0xff;
    vh.aSeekBar.current.progress = a / 0xff;
  }
}

@Entry
export class ColorPalettePanel extends VMPanel<ColorModel, ColorVH> {
  getViewModelClass() {
    return ColorVM;
  }
  getState() {
    const val = Math.floor(0xff * 0.3);
    let color = val | ((val << 8) | (val << 16) | 0xff000000);
    return {
      color,
    };
  }
  getViewHolderClass() {
    return ColorVH;
  }
}
