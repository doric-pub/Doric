import {
  jsx,
  Panel,
  Group,
  Color,
  layoutConfig,
  Gravity,
  Scroller,
  VLayout,
  Text,
  Stack,
  HLayout,
} from "doric";

function Grid(props: { title: string; innerElement: JSX.Element }) {
  return (
    <VLayout>
      <Text
        text={props.title}
        backgroundColor={Color.parse("#3498db")}
        textColor={Color.WHITE}
        textAlignment={Gravity.CenterX}
        layoutConfig={layoutConfig().mostWidth().justHeight()}
        height={30}
      />
      <Stack
        layoutConfig={layoutConfig().just()}
        width={300}
        height={300}
        backgroundColor={Color.parse("#ecf0f1")}
      >
        {props.innerElement}
      </Stack>
    </VLayout>
  );
}

function Content() {
  return (
    <>
      <Text textColor={Color.WHITE} backgroundColor={Color.parse("#34495e")}>
        Content
      </Text>
      <Stack
        layoutConfig={layoutConfig().just().configMargin({
          left: 10,
          right: 10,
          top: 10,
          bottom: 10,
        })}
        width={100}
        height={100}
        backgroundColor={Color.parse("#34495e")}
      />
    </>
  );
}

function Case1() {
  return (
    <Stack
      padding={{
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      }}
      backgroundColor={Color.parse("#9b59b6")}
    >
      <Stack
        layoutConfig={layoutConfig().most()}
        backgroundColor={Color.parse("#1abc9c")}
      >
        <Content />
      </Stack>
    </Stack>
  );
}

function Case2() {
  return (
    <Stack
      padding={{
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      }}
      backgroundColor={Color.parse("#9b59b6")}
    >
      <Stack
        layoutConfig={layoutConfig().most()}
        backgroundColor={Color.parse("#1abc9c")}
      ></Stack>
      <Content />
    </Stack>
  );
}

function Case3() {
  return (
    <Stack
      backgroundColor={Color.parse("#2ecc71")}
      padding={{
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      }}
    >
      <Case1 />
    </Stack>
  );
}
function Case4() {
  return (
    <Stack
      backgroundColor={Color.parse("#2ecc71")}
      padding={{
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      }}
    >
      <Case2 />
    </Stack>
  );
}

function Case5() {
  return (
    <Stack
      backgroundColor={Color.parse("#3498db")}
      padding={{
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      }}
    >
      <Case3 />
    </Stack>
  );
}

function Case6() {
  return (
    <Stack
      backgroundColor={Color.parse("#3498db")}
      padding={{
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      }}
    >
      <Case3 />
    </Stack>
  );
}

@Entry
class LayoutTest extends Panel {
  build(root: Group) {
    <Scroller parent={root} layoutConfig={layoutConfig().most()}>
      <VLayout
        layoutConfig={layoutConfig().mostWidth().fitHeight()}
        gravity={Gravity.Center}
        space={20}
      >
        <Grid title="VLayout fit -> VLayout weight -> fit , most">
          <VLayout>
            <VLayout
              layoutConfig={layoutConfig()
                .fitWidth()
                .justHeight()
                .configWeight(1)}
            >
              <Text>Content</Text>
              <Stack
                layoutConfig={layoutConfig().mostWidth().justHeight()}
                height={20}
                backgroundColor={Color.RED.alpha(0.1)}
              />
            </VLayout>
          </VLayout>
        </Grid>

        <Grid title="VLayout fit -> HLayout weight -> fit , most">
          <VLayout>
            <HLayout
              layoutConfig={layoutConfig()
                .fitWidth()
                .justHeight()
                .configWeight(1)}
            >
              <Text>Content</Text>
              <Stack
                layoutConfig={layoutConfig().justWidth().mostHeight()}
                width={100}
                backgroundColor={Color.RED.alpha(0.1)}
              ></Stack>
            </HLayout>
          </VLayout>
        </Grid>

        <Grid title="VLayout fit -> Stack weight -> fit , most">
          <VLayout>
            <Stack
              layoutConfig={layoutConfig()
                .fitWidth()
                .justHeight()
                .configWeight(1)}
            >
              <Text>Content</Text>
              <Stack
                layoutConfig={layoutConfig().mostWidth().justHeight()}
                height={20}
                backgroundColor={Color.RED.alpha(0.1)}
              ></Stack>
            </Stack>
          </VLayout>
        </Grid>

        <Grid title="HLayout fit -> HLayout weight -> fit , most">
          <HLayout>
            <HLayout
              layoutConfig={layoutConfig()
                .justWidth()
                .fitHeight()
                .configWeight(1)}
            >
              <Text>Content</Text>
              <Stack
                layoutConfig={layoutConfig().mostHeight().justWidth()}
                width={100}
                backgroundColor={Color.RED.alpha(0.1)}
              ></Stack>
            </HLayout>
          </HLayout>
        </Grid>

        <Grid title="HLayout fit -> VLayout weight -> fit , most">
          <HLayout>
            <VLayout
              layoutConfig={layoutConfig()
                .justWidth()
                .fitHeight()
                .configWeight(1)}
            >
              <Text>Content</Text>
              <Stack
                layoutConfig={layoutConfig().mostWidth().justHeight()}
                height={20}
                backgroundColor={Color.RED.alpha(0.1)}
              ></Stack>
            </VLayout>
          </HLayout>
        </Grid>
        <Grid title="HLayout fit -> Stack weight -> fit , most">
          <HLayout>
            <Stack
              layoutConfig={layoutConfig()
                .justWidth()
                .fitHeight()
                .configWeight(1)}
            >
              <Text>Content</Text>
              <Stack
                layoutConfig={layoutConfig().mostHeight().justWidth()}
                width={100}
                backgroundColor={Color.RED.alpha(0.1)}
              ></Stack>
            </Stack>
          </HLayout>
        </Grid>
        <Grid title="VLayout fit -> most -> just">
          <VLayout
            layoutConfig={layoutConfig().fit()}
            padding={{
              left: 10,
              right: 10,
              top: 10,
              bottom: 10,
            }}
            backgroundColor={Color.parse("#9b59b6")}
          >
            <Stack
              layoutConfig={layoutConfig().most()}
              backgroundColor={Color.parse("#1abc9c")}
              padding={{
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
              }}
            >
              <Content></Content>
            </Stack>
          </VLayout>
        </Grid>
        <Grid title="VLayout fit -> most, just">
          <VLayout
            layoutConfig={layoutConfig().fit()}
            padding={{
              left: 10,
              right: 10,
              top: 10,
              bottom: 10,
            }}
            backgroundColor={Color.parse("#9b59b6")}
          >
            <Stack
              layoutConfig={layoutConfig().most()}
              backgroundColor={Color.parse("#1abc9c")}
              padding={{
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
              }}
            ></Stack>
            <Content></Content>
          </VLayout>
        </Grid>

        <Grid title="HLayout fit -> most -> just">
          <HLayout
            layoutConfig={layoutConfig().fit()}
            padding={{
              left: 10,
              right: 10,
              top: 10,
              bottom: 10,
            }}
            backgroundColor={Color.parse("#9b59b6")}
          >
            <Stack
              layoutConfig={layoutConfig().most()}
              backgroundColor={Color.parse("#1abc9c")}
              padding={{
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
              }}
            >
              <Content></Content>
            </Stack>
          </HLayout>
        </Grid>
        <Grid title="HLayout fit -> most, just">
          <HLayout
            layoutConfig={layoutConfig().fit()}
            padding={{
              left: 10,
              right: 10,
              top: 10,
              bottom: 10,
            }}
            backgroundColor={Color.parse("#9b59b6")}
          >
            <Stack
              layoutConfig={layoutConfig().most()}
              backgroundColor={Color.parse("#1abc9c")}
              padding={{
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
              }}
            ></Stack>
            <Content></Content>
          </HLayout>
        </Grid>
        <Grid title="Stack fit -> most -> just">
          <Case1 />
        </Grid>

        <Grid title="Stack fit -> most, just">
          <Case2 />
        </Grid>
        <Grid title="Stack fit -> fit -> most -> just">
          <Case3 />
        </Grid>
        <Grid title="Stack fit -> fit -> most, just">
          <Case4 />
        </Grid>
        <Grid title="Stack fit -> fit -> fit -> most -> just">
          <Case5 />
        </Grid>
        <Grid title="Stack fit -> fit -> fit -> most, just">
          <Case6 />
        </Grid>
      </VLayout>
    </Scroller>;
  }
}
