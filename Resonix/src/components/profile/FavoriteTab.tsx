import { FC } from 'react';
import { ScrollView } from 'react-native';
import { useFetchFavorite } from 'src/hooks/query';
import AudioListItem from '@ui/AudioListItem';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import EmptyRecords from '@ui/EmptyRecords';

interface Props {}

const FavoriteTab: FC<Props> = () => {
  const { data = [], isLoading } = useFetchFavorite();

  if (isLoading) {
    return <AudioListLoadingUI items={data.length || 11} />;
  }

  return (
    <ScrollView>
      {data.length > 0 ? (
        data.map(audio => (
          <AudioListItem onPress={() => {}} key={audio.id} audio={audio} />
        ))
      ) : (
        <EmptyRecords title="No Favorites Found!" />
      )}
    </ScrollView>
  );
};

export default FavoriteTab;
