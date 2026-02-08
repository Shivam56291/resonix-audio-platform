import { FC } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';

import { useFetchRecentlyPlayed } from 'src/hooks/query';
import colors from 'utils/colors';
import AudioCard from 'ui/AudioCard';
import PulseAnimationContainer from 'ui/PulseAnimationContainer';
import { AudioData } from 'src/@types/audio';
import { getPlayerState } from 'src/store/player';

interface Props {
  onAudioPress: (audio: AudioData, data: AudioData[]) => void;
  onAudioLongPress: (audio: AudioData, data: AudioData[]) => void;
}

const dummyData = new Array(4).fill('');

const RecentlyPlayed: FC<Props> = ({
  onAudioPress,
  onAudioLongPress,
}) => {
  const { data, isLoading } = useFetchRecentlyPlayed();
  const { onGoingAudio } = useSelector(getPlayerState);

  console.log(data);

  if (isLoading) {
    return (
      <PulseAnimationContainer>
        <View style={styles.dummyContainer}>
          <View style={styles.dummyTitleView} />
          <View style={styles.dummyAudioContainer}>
            {dummyData.map((_, index) => (
              <PulseAnimationContainer key={index} delay={index * 120}>
                <View style={styles.dummyAudioView} />
              </PulseAnimationContainer>
            ))}
          </View>
        </View>
      </PulseAnimationContainer>
    );
  }

  if (!data?.length) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Recently Played</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data.map(audio => (
          <AudioCard
            key={audio.id}
            title={audio.title}
            poster={audio.poster}
            onPress={() => onAudioPress(audio, data)}
            onLongPress={() => onAudioLongPress(audio, data)}
            playing={onGoingAudio?.id === audio.id}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  dummyContainer: {
    padding: 20,
  },
  dummyAudioView: {
    width: 100,
    height: 100,
    borderRadius: 7,
    backgroundColor: colors.INACTIVE_CONTRAST,
    marginBottom: 15,
    marginRight: 15,
    opacity: 0.85,
  },
  dummyAudioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: colors.CONTRAST,
    borderBottomWidth: 1,
    borderBottomColor: colors.SECONDARY,
    letterSpacing: 0.3,
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 5,
    marginBottom: 15,
    alignSelf: 'flex-start',
    marginLeft: 13,
  },
  dummyTitleView: {
    width: 150,
    height: 20,
    borderRadius: 7,
    backgroundColor: colors.INACTIVE_CONTRAST,
    marginBottom: 15,
  },
});

export default RecentlyPlayed;
