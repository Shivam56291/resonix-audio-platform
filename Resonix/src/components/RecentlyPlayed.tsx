import GridView from '@ui/GridView';
import RecentlyPlayedCard from '@ui/RecentlyPlayedCard';
import colors from '@utils/colors';
import { FC } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { useFetchRecentlyPlayed } from 'src/hooks/query';
import PulseAnimationContainer from 'ui/PulseAnimationContainer';

interface Props {
  onAudioPress?: (audio: AudioData) => void;
}

const dummyData = Array.from({ length: 4 });

const RecentlyPlayed: FC<Props> = () => {
  const { data, isLoading } = useFetchRecentlyPlayed();

  if (isLoading) {
    return (
      <PulseAnimationContainer>
        <View>
          <View style={styles.dummyTitleView} />
          <GridView
            data={dummyData}
            renderItem={() => {
              return (
                <View style={styles.dummyItemView} />
              );
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
        data={data || []}
        renderItem={item => {
          return (
            <View key={item.id} style={styles.listStyle}>
              <RecentlyPlayedCard
                title={item.title}
                poster={item.poster}
                onPress={() => {}}
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  listStyle: {
    marginBottom: 10,
  },
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
