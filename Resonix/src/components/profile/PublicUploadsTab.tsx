import { ScrollView } from 'react-native';
import { FC } from 'react';
import { useFetchPublicUploads } from 'hooks/query';
import AudioListLoadingUI from 'ui/AudioListLoadingUI';
import AudioListItem from 'ui/AudioListItem';
import EmptyRecords from 'ui/EmptyRecords';
import useAudioController from 'hooks/useAudioController';
import { useSelector } from 'react-redux';
import { getPlayerState } from 'store/player';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { PublicProfileTopTabParamList } from 'views/PublicProfile';

type Props = MaterialTopTabScreenProps<
  PublicProfileTopTabParamList,
  'Uploads'
>;

const PublicUploadsTab: FC<Props> = props => {
  const { data = [], isLoading } = useFetchPublicUploads(
    props.route.params.profileId,
  );
  const { onAudioPress } = useAudioController();
  const { onGoingAudio } = useSelector(getPlayerState);

  if (isLoading) {
    return <AudioListLoadingUI items={data?.length || 11} />;
  }

  return (
    <ScrollView>
      {data?.length > 0 ? (
        data?.map(audio => (
          <AudioListItem
            onPress={() => onAudioPress(audio, data)}
            key={audio.id}
            audio={audio}
            isPlaying={onGoingAudio?.id === audio.id}
          />
        ))
      ) : (
        <EmptyRecords title="No Uploads Found!" />
      )}
    </ScrollView>
  );
};

export default PublicUploadsTab;
