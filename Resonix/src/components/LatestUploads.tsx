import { FC } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';

import { useFetchLatestAudios } from 'src/hooks/query';
import colors from 'src/utils/colors';
import AudioCard from 'src/ui/AudioCard';
import PulseAnimationContainer from 'src/ui/PulseAnimationContainer';
import { AudioData } from 'src/@types/audio';

interface Props {
  onAudioPress: (audio: AudioData, data: AudioData[]) => void;
  onAudioLongPress: (audio: AudioData, data: AudioData[]) => void;
}

const dummyData = new Array(4).fill('');

const LatestUploads: FC<Props> = ({ onAudioPress, onAudioLongPress }) => {
  const { data, isLoading } = useFetchLatestAudios();

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

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Latest Uploads</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data?.map(audio => (
          <AudioCard
            key={audio.id}
            title={audio.title}
            poster={audio.poster}
            onPress={() => {onAudioPress(audio, data)}}
            onLongPress={() => {onAudioLongPress(audio, data)}}
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
  loadingText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
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

export default LatestUploads;
