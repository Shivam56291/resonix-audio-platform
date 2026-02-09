import { FC } from 'react';
import { Text, View } from 'react-native';

import { useFetchRecommendedPlaylist } from '../hooks/query';

interface Props {}

const RecommendedPlaylist: FC<Props> = () => {
  const { data } = useFetchRecommendedPlaylist();
  return (
    <View>
      {data?.map(playlist => (
        <View key={playlist.id}>
          <Text>{playlist.title}</Text>
        </View>
      ))}
    </View>
  );
};

export default RecommendedPlaylist;
