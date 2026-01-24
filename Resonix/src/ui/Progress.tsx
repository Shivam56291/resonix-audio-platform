import { FC } from 'react';
import { Animated, Easing } from 'react-native';
import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from 'utils/colors';

interface Props {
  progress: number;
}

const Progress: FC<Props> = ({ progress }) => {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
      easing: Easing.out(Easing.ease),
    }).start();
  }, [progress, widthAnim]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{progress}%</Text>
      <View style={styles.barBackground}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: widthAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%' },
  title: {
    color: colors.CONTRAST,
    paddingBottom: 4,
    alignSelf: 'flex-end',
  },
  barBackground: {
    height: 10,
    backgroundColor: colors.INACTIVE_CONTRAST,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: 10,
    backgroundColor: colors.CONTRAST,
    borderRadius: 5,
  },
});

export default Progress;
