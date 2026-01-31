import { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { getPlayerState } from 'store/player';

import { useFetchRecommendedAudios } from 'src/hooks/query';
import colors from 'src/utils/colors';
import GridView from 'src/ui/GridView';
import PulseAnimationContainer from 'ui/PulseAnimationContainer';
import { AudioData } from 'src/@types/audio';
import AudioCard from 'ui/AudioCard';

interface Props {
  onAudioPress: (audio: AudioData, data: AudioData[]) => void;
  onAudioLongPress: (audio: AudioData, data: AudioData[]) => void;
}

const dummyData = new Array(6).fill('');

const DummyAudioItem = () => {
  return (
    <View>
      <View style={styles.dummyPoster} />
      <View style={styles.dummyTextLine} />
      <View style={styles.dummyTextLineSmall} />
    </View>
  );
};

const RecommendedAudio: FC<Props> = ({ onAudioPress, onAudioLongPress }) => {
  const { data = [], isLoading } = useFetchRecommendedAudios();
  const { onGoingAudio } = useSelector(getPlayerState);

  if (isLoading) {
    return (
      <PulseAnimationContainer>
        <View style={styles.dummyContainer}>
          <View style={styles.dummyTitleView} />
          <GridView
            col={3}
            data={dummyData}
            renderItem={() => <DummyAudioItem />}
          />
        </View>
      </PulseAnimationContainer>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>You May Also Like</Text>

      <GridView
        col={3}
        data={data || []}
        renderItem={item => {
          return (
            <AudioCard
              title={item.title}
              poster={item.poster}
              onPress={() => onAudioPress(item, data)}
              onLongPress={() => onAudioLongPress(item, data)}
              containerStyle={{
                width: '100%',
                paddingHorizontal: 1,
              }}
              playing={onGoingAudio?.id === item.id}
            />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  dummyContainer: {
    padding: 10,
  },
  dummyAudioView: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.INACTIVE_CONTRAST,
    borderRadius: 7,
  },
  dummyTitleView: {
    marginLeft: 10,
    width: 150,
    height: 20,
    borderRadius: 7,
    backgroundColor: colors.INACTIVE_CONTRAST,
    marginBottom: 15,
  },
  headerTitle: {
    color: colors.CONTRAST,
    borderBottomWidth: 1,
    borderBottomColor: colors.SECONDARY,
    letterSpacing: 0.3,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  audioTitle: {
    color: colors.CONTRAST,
    fontWeight: '500',
    fontSize: 16,
    marginTop: 5,
  },
  poster: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 7,
  },
  dummyPoster: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 7,
    backgroundColor: colors.INACTIVE_CONTRAST,
  },

  dummyTextLine: {
    height: 14,
    marginTop: 6,
    borderRadius: 5,
    backgroundColor: colors.INACTIVE_CONTRAST,
  },

  dummyTextLineSmall: {
    height: 14,
    marginTop: 4,
    width: '70%',
    borderRadius: 5,
    backgroundColor: colors.INACTIVE_CONTRAST,
  },
});

export default RecommendedAudio;
