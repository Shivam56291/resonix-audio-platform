import GridView from '@ui/GridView';
import RecentlyPlayedCard from '@ui/RecentlyPlayedCard';
import colors from '@utils/colors';
import { FC } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { useFetchRecentlyPlayed } from 'src/hooks/query';
import PulseAnimationContainer from 'ui/PulseAnimationContainer';
import useAudioController from 'hooks/useAudioController';
import { useSelector } from 'react-redux';
import { getPlayerState } from 'store/player';

interface Props {}

const dummyData = Array.from({ length: 4 });

const RecentlyPlayed: FC<Props> = () => {
  const { data = [], isLoading } = useFetchRecentlyPlayed();
  const { onGoingAudio } = useSelector(getPlayerState);
  const { onAudioPress } = useAudioController();

  if (isLoading) {
    return (
      <PulseAnimationContainer>
        <View>
          <View style={styles.dummyTitleView} />
          <GridView
            data={dummyData}
            renderItem={() => {
              return <View style={styles.dummyItemView} />;
            }}
          />
        </View>
      </PulseAnimationContainer>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recently Played</Text>
      <GridView
        data={data}
        renderItem={item => {
          return (
            <View key={item.id} style={styles.listStyle}>
              <RecentlyPlayedCard
                title={item.title}
                poster={item.poster}
                onPress={() => onAudioPress(item, data)}
                isPlaying={item.id === onGoingAudio?.id}
              />
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  title: {
    color: colors.CONTRAST,
    borderBottomWidth: 1,
    borderBottomColor: colors.SECONDARY,
    letterSpacing: 0.3,
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 5,
    alignSelf: 'flex-start',
    marginLeft: 22,
  },
  listStyle: {},
  dummyTitleView: {
    marginLeft: 18,
    height: 20,
    width: 150,
    backgroundColor: colors.INACTIVE_CONTRAST,
    borderRadius: 5,
    marginBottom: 15,
  },
  dummyItemView: {
    height: 50,
    backgroundColor: colors.INACTIVE_CONTRAST,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default RecentlyPlayed;
