import {useEffect} from 'react';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  measure,
  runOnJS,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {clamp, snapPoint} from 'react-native-redash';

import {Toast} from '../../components';
import type {ToastConfig} from './ToastContext';

export const AnimatedToast: React.FC<{toast: ToastConfig; hide: () => void}> = ({toast, hide}) => {
  const containerRef = useAnimatedRef<Animated.View>();

  const top = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    setTimeout(onDismiss, toast.timeout ?? 10_000);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pan = Gesture.Pan()
    .onChange(({translationY}) => {
      translateY.value = clamp(translationY, -999, 0);
    })
    .onEnd(({velocityY}) => {
      const bounds = measure(containerRef);
      const height = bounds?.height ?? 0;

      const snapTo = snapPoint(translateY.value, velocityY, [-height, 0]);

      if (snapTo < 0) {
        top.value = withTiming(1, {duration: 200}, () => {
          runOnJS(hide)();
        });
      }

      translateY.value = withTiming(snapTo, {duration: 200});
    });

  const animatedStyle = useAnimatedStyle(() => ({
    top: `${top.value * 100 * -1}%`,
    transform: [{translateY: translateY.value}],
  }));

  const onDismiss = () => {
    top.value = withTiming(1, {duration: 200}, () => {
      runOnJS(hide)();
    });
  };

  return (
    <GestureDetector gesture={pan}>
      <Animated.View ref={containerRef} style={animatedStyle}>
        <Toast {...toast} onDismiss={onDismiss} />
      </Animated.View>
    </GestureDetector>
  );
};
