import React, { FC, useEffect } from 'react';
import {
  DeviceEventEmitter,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeInDown,
  FadeOutDown,
  LinearTransition,
} from 'react-native-reanimated';

import { useFetchHistories } from 'src/hooks/query';
import EmptyRecords from 'ui/EmptyRecords';
import AudioListLoadingUI from 'ui/AudioListLoadingUI';
import colors from 'utils/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { queryClient } from 'src/queryClient';

interface Props {}

const HistoryTab: FC<Props> = () => {
  const { data, isLoading } = useFetchHistories();

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener('HISTORY_UPDATED', () => {
      queryClient.invalidateQueries({ queryKey: ['histories'] });
    });

    return () => sub.remove();
  }, []);

  if (isLoading) return <AudioListLoadingUI />;

  if (!data || !data[0]?.audios?.length) {
    return <EmptyRecords title="There is no history!" />;
  }

  return (
    <SectionList
      sections={data.map(item => ({
        title: item.date,
        data: item.audios,
      }))}
      keyExtractor={item => item.id}
      stickySectionHeadersEnabled={false}
      contentContainerStyle={styles.container}
      renderSectionHeader={({ section }) => (
        <Text style={styles.dateLabel}>{section.title}</Text>
      )}
      renderItem={({ item, index }) => (
        <Animated.View
          layout={LinearTransition.springify().damping(18).stiffness(160)}
          entering={FadeInDown.delay(index * 40)}
          exiting={FadeOutDown.springify().damping(14)}
          style={styles.row}
        >
          <Text numberOfLines={1} style={styles.title}>
            {item.title}
          </Text>
          <DeleteButton onPress={() => {}} />
        </Animated.View>
      )}
    />
  );
};

const DeleteButton: FC<{ onPress: () => void }> = ({ onPress }) => {
  const scale = useSharedValue(1);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={style}>
      <Pressable
        hitSlop={10}
        onPressIn={() => (scale.value = withSpring(0.85))}
        onPressOut={() => (scale.value = withSpring(1))}
        onPress={() => {
          scale.value = withSpring(0.7);
          setTimeout(onPress, 120);
        }}
      >
        <MaterialCommunityIcons
          name="trash-can-outline"
          size={20}
          color={colors.SECONDARY}
        />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },

  dateLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.SECONDARY,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },

  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.CONTRAST,
  },
  deletePressed: {
    opacity: 0.6,
    transform: [{ scale: 0.9 }],
  },
});

export default HistoryTab;
