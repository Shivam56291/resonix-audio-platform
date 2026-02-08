import React, { FC, useEffect, useState } from 'react';
import {
  DeviceEventEmitter,
  Pressable,
  RefreshControl,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  FadeInDown,
  FadeOutDown,
  LinearTransition,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';

import { useFetchHistories } from 'src/hooks/query';
import EmptyRecords from 'ui/EmptyRecords';
import AudioListLoadingUI from 'ui/AudioListLoadingUI';
import colors from 'utils/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getClient } from 'api/client';
import { History, HistoryAudio } from 'src/@types/audio';
import { useNavigation } from '@react-navigation/native';

interface Props {}

const HistoryTab: FC<Props> = () => {
  const { data, isLoading, isFetching } = useFetchHistories();
  const [showHint, setShowHint] = useState(true);
  const queryClient = useQueryClient();
  const [selectedHistories, setSelectedHistories] = useState<string[]>([]);
  const navigation = useNavigation();
  const barTranslate = useSharedValue(-60);
  const barScale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-10);

  const removeMutate = useMutation({
    mutationFn: async histories => removeHistories(histories),
    onMutate: async (values: string[]) => {
      queryClient.setQueryData<History[]>(['histories'], oldData => {
        let newData: History[] = [];
        if (!oldData) return newData;

        for (let history of oldData) {
          const filteredData = history.audios.filter(
            audio => !values.includes(audio.id),
          );
          if (filteredData.length) {
            newData.push({
              date: history.date,
              audios: filteredData,
            });
          }
        }
        return newData;
      });
    },
  });

  const removeHistories = async (histories: string[]) => {
    const client = await getClient();
    await client.delete('/history?histories=' + JSON.stringify(histories));
    queryClient.invalidateQueries({ queryKey: ['histories'] });
  };

  const handleSingleHistoryRemove = async (history: HistoryAudio) => {
    removeMutate.mutate([history.id]);
  };

  const handleOnLongPress = (history: HistoryAudio) => {
    setSelectedHistories(prev => {
      if (prev.includes(history.id)) {
        return prev.filter(id => id !== history.id);
      }
      return [...prev, history.id];
    });
  };

  const handleOnRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['histories'] });
  };

  const handleMultipleHistoryRemove = async () => {
    removeMutate.mutate(selectedHistories);
    setSelectedHistories([]);
  };

  useEffect(() => {
    const show = selectedHistories.length > 0;
    barTranslate.value = withTiming(show ? 0 : -60, { duration: 150 });
    barScale.value = withTiming(show ? 1 : 0.8, { duration: 150 });
  }, [selectedHistories.length, barTranslate, barScale]);

  useEffect(() => {
    if (!showHint) return;

    // Fade in
    opacity.value = withTiming(1, { duration: 500 });

    // Slight bounce
    translateY.value = withSequence(
      withTiming(5, { duration: 300 }),
      withSpring(0),
    );

    // Fade out after 3 seconds
    opacity.value = withDelay(2500, withTiming(0, { duration: 500 }));

    const timer = setTimeout(() => {
      setShowHint(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showHint, opacity, translateY]);

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener('HISTORY_UPDATED', () => {
      queryClient.invalidateQueries({ queryKey: ['histories'] });
    });

    return () => sub.remove();
  }, [queryClient]);

  useEffect(() => {
    const unSelectHistories = () => {
      setSelectedHistories([]);
    };
    navigation.addListener('blur', () => {
      unSelectHistories();
    });

    return () => {
      navigation.removeListener('blur', unSelectHistories);
    };
  }, [navigation]);

  const animatedTextStyle = useAnimatedStyle(() => ({
    transform: [{ scale: barScale.value }],
    opacity: barScale.value,
  }));

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  if (isLoading) return <AudioListLoadingUI />;

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      {selectedHistories.length > 0 && (
        <Animated.View
          style={[
            {
              transform: [{ translateY: barTranslate.value }],
            },
            styles.removeBtnContainer,
          ]}
          entering={FadeInDown.duration(150)}
          exiting={FadeOutDown.duration(150)}
        >
          <Pressable
            style={({ pressed }) => [
              {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 30,
                backgroundColor: 'rgba(255,255,255,0.075)',
                opacity: pressed ? 0.8 : 1,
                transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }],
              },
            ]}
            onPress={handleMultipleHistoryRemove}
          >
            <Animated.Text style={[styles.removeBtnText, animatedTextStyle]}>
              {selectedHistories.length} selected
            </Animated.Text>
            <Animated.View
              entering={FadeInDown.duration(150).delay(50)}
              style={{ marginLeft: 10 }}
            >
              <Ionicons
                name="trash-bin-outline"
                color={colors.CONTRAST}
                size={24}
              />
            </Animated.View>
          </Pressable>
        </Animated.View>
      )}

      {showHint && (
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              top: 20,
              alignSelf: 'center',
              backgroundColor: 'rgba(28,28,30,0.95)',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              zIndex: 100,
            },
            animatedStyle,
          ]}
        >
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '500' }}>
            ↓ Pull down to refresh
          </Text>
        </Animated.View>
      )}

      <SectionList
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={handleOnRefresh}
            tintColor={colors.CONTRAST}
            colors={[colors.CONTRAST]}
            progressBackgroundColor="rgba(255,255,255,0.08)"
            progressViewOffset={60}
          />
        }
        sections={
          data?.length
            ? data.map(item => ({
                title: item.date,
                data: item.audios,
              }))
            : []
        }
        keyExtractor={item => item.id}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={[
          styles.container,
          !data?.length && { flexGrow: 1 }, // 🔥 IMPORTANT
        ]}
        ListEmptyComponent={
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <EmptyRecords title="There is no history!" />
          </View>
        }
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Fontisto name="date" color={colors.SECONDARY} size={18} />
            <Text style={styles.dateLabel}>{section.title}</Text>
          </View>
        )}
        renderItem={({ item, index }) => {
          const isSelected = selectedHistories.includes(item.id);

          return (
            <Pressable
              onLongPress={() => handleOnLongPress(item)}
              onPress={() => {
                if (selectedHistories.length > 0) {
                  setSelectedHistories(prev => {
                    if (prev.includes(item.id)) {
                      return prev.filter(id => id !== item.id);
                    }
                    return [...prev, item.id];
                  });
                }
              }}
            >
              <Animated.View
                layout={LinearTransition.duration(120)}
                entering={FadeInDown.delay(index * 40)}
                exiting={FadeOutDown.duration(120)}
                style={[styles.row, isSelected && styles.selectedRow]}
              >
                <Text numberOfLines={1} style={styles.title}>
                  {item.title}
                </Text>

                {selectedHistories.length > 0 ? (
                  <MaterialCommunityIcons
                    name={
                      isSelected ? 'checkbox-marked' : 'checkbox-blank-outline'
                    }
                    size={22}
                    color={colors.SECONDARY}
                  />
                ) : (
                  <DeleteButton
                    onPress={() => handleSingleHistoryRemove(item)}
                  />
                )}
              </Animated.View>
            </Pressable>
          );
        }}
      />
    </View>
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
        onPressIn={() => (scale.value = withTiming(0.85, { duration: 80 }))}
        onPressOut={() => (scale.value = withTiming(1, { duration: 120 }))}
        onPress={() => {
          scale.value = withTiming(0.7, { duration: 80 });
          setTimeout(onPress, 80);
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
  removeBtnContainer: {
    position: 'absolute',
    top: -10,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'flex-end',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  removeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 18,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  removeBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.CONTRAST,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },
  dateLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.SECONDARY,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  selectedRow: {
    backgroundColor: 'rgba(255,255,255,0.075)',
    borderBottomWidth: 0.5,
    borderRadius: 12,
    borderTopWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.09)',
    borderTopColor: 'rgba(255,255,255,0.08)',
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
