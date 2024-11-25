import { View, Text, Pressable, type PressableProps } from "react-native";
import type React from "react";
import Animated, {
  FadeInDown,
  FadeInLeft,
  FadeOutLeft,
  FadeOutUp,
  LinearTransition,
  type SharedValue,
  useDerivedValue,
  withSpring,
  type AnimatedProps,
  useAnimatedStyle,
  interpolateColor
} from "react-native-reanimated";

const _spacing = 8;
const _buttonHeight = 42;
const _layoutTransition = LinearTransition.springify()
  .damping(80)
  .stiffness(200);
const _dotContainer = 24;
const _dotSize = _dotContainer / 3;
const _activeDot = "#fff";
const _inactiveDot = "#aaa";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Button: React.FC<AnimatedProps<PressableProps>> = ({
  children,
  style,
  ...rest
}) => {
  return (
    <AnimatedPressable
      style={[
        {
          height: _buttonHeight,
          borderRadius: _buttonHeight / 2,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: _spacing * 2
        },
        style
      ]}
      // stiffness 的值越大，弹簧的弹性越大，弹簧的运动越快。
      // damping 的值越大，弹簧的阻尼越大，弹簧的运动越慢。
      entering={FadeInLeft.springify().damping(80).stiffness(200)}
      exiting={FadeOutLeft.springify().damping(80).stiffness(200)}
      layout={_layoutTransition}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
};

type DotProps = {
  index: number;
  animation: SharedValue<number>;
};
const Dot: React.FC<DotProps> = ({ index, animation }) => {
  const stylez = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        animation.value,
        [index - 1, index, index + 1],
        [_inactiveDot, _activeDot, _activeDot]
      )
    };
  });

  return (
    <View
      style={{
        width: _dotContainer,
        aspectRatio: 1,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Animated.View
        style={[
          stylez,
          {
            width: _dotSize,
            height: _dotSize,
            borderRadius: _dotSize
          }
        ]}
      />
    </View>
  );
};

type PaginationIndicatorProps = {
  animation: SharedValue<number>;
};
const PaginationIndicator: React.FC<PaginationIndicatorProps> = ({
  animation
}) => {
  const stylez = useAnimatedStyle(() => {
    return {
      width: _dotContainer + _dotContainer * animation.value
    };
  });
  return (
    <Animated.View
      style={[
        {
          backgroundColor: "#29be56",
          height: _dotContainer,
          width: _dotContainer,
          borderRadius: _dotContainer,
          position: "absolute",
          left: 0,
          top: 0
        },
        stylez
      ]}
    />
  );
};

type PaginationProps = {
  total: number;
  selectedIndex: number;
};
const Pagination: React.FC<PaginationProps> = ({ total, selectedIndex }) => {
  const animation = useDerivedValue(() => {
    return withSpring(selectedIndex, {
      damping: 80,
      stiffness: 200
    });
  });

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <View
        style={{
          flexDirection: "row"
        }}
      >
        <PaginationIndicator animation={animation} />

        {[...Array(total).keys()].map((index) => (
          <Dot key={`dot-${index}`} index={index} animation={animation} />
        ))}
      </View>
    </View>
  );
};

type OnboardingProps = {
  total: number;
  selectedIndex: number;
  onIndexChange: (index: number) => void;
};
export const Onboarding: React.FC<OnboardingProps> = ({
  total,
  selectedIndex,
  onIndexChange
}) => {
  return (
    <View style={{ padding: _spacing, gap: _spacing * 2 }}>
      <Pagination total={total} selectedIndex={selectedIndex} />
      <View
        style={{
          flexDirection: "row",
          gap: _spacing
        }}
      >
        {selectedIndex > 0 && (
          <Button
            style={{
              backgroundColor: "#ddd"
            }}
            onPress={() => {
              onIndexChange(selectedIndex - 1);
            }}
          >
            <Text>Back</Text>
          </Button>
        )}
        <Button
          style={{
            backgroundColor: "#036bfb",
            flex: 1
          }}
          onPress={() => {
            if (selectedIndex === total - 1) {
              return;
            }

            onIndexChange(selectedIndex + 1);
          }}
        >
          {selectedIndex === total - 1 ? (
            <Animated.Text
              key={"finish"}
              style={{
                color: "#fff"
              }}
              entering={FadeInDown.springify().damping(80).stiffness(200)}
              exiting={FadeOutUp.springify().damping(80).stiffness(200)}
            >
              Finish
            </Animated.Text>
          ) : (
            <Animated.Text
              key={"continue"}
              style={{
                color: "#fff"
              }}
              entering={FadeInDown.springify().damping(80).stiffness(200)}
              exiting={FadeOutUp.springify().damping(80).stiffness(200)}
              layout={_layoutTransition}
            >
              Continue
            </Animated.Text>
          )}
        </Button>
      </View>
    </View>
  );
};
