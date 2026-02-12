import { FC } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { useFetchFavorite } from 'src/hooks/query';
import AudioListItem from '@ui/AudioListItem';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import EmptyRecords from '@ui/EmptyRecords';
import { useSelector } from 'react-redux';
import { getPlayerState } from 'store/player';
import useAudioController from 'hooks/useAudioController';
import colors from 'utils/colors';
import { useQueryClient } from '@tanstack/react-query';

interface Props {}

const FavoriteTab: FC<Props> = () => {
  const { data = [], isLoading, isFetching } = useFetchFavorite();
  const { onGoingAudio } = useSelector(getPlayerState);
  const { onAudioPress } = useAudioController();
  const queryClient = useQueryClient();

  const handleOnRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['favorites'] });
  };

  if (isLoading) {
    return <AudioListLoadingUI items={data.length || 11} />;
  }

  return (
    <ScrollView
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
    >
      {data.length > 0 ? (
        data.map(audio => (
          <AudioListItem
            onPress={() => onAudioPress(audio, data)}
            key={audio.id}
            audio={audio}
            isPlaying={onGoingAudio?.id === audio.id}
          />
        ))
      ) : (
        <EmptyRecords title="No Favorites Found!" />
      )}
    </ScrollView>
  );
};

export default FavoriteTab;
