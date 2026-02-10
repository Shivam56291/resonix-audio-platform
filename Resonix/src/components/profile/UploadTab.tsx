import { FC } from 'react';
import { ScrollView } from 'react-native';
import { useSelector } from 'react-redux';

import { useFetchUploadsByProfile } from 'src/hooks/query';
import AudioListItem from '@ui/AudioListItem';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import EmptyRecords from '@ui/EmptyRecords';
import useAudioController from 'hooks/useAudioController';

import { getPlayerState } from 'store/player';

interface Props {}

const UploadTab: FC<Props> = () => {
  const { onGoingAudio } = useSelector(getPlayerState);
  const { data = [], isLoading } = useFetchUploadsByProfile();
  const { onAudioPress } = useAudioController();

  if (isLoading) {
    return <AudioListLoadingUI items={data.length || 11} />;
  }

  return (
    <ScrollView>
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
        <EmptyRecords title="No Uploads Found!" />
      )}
    </ScrollView>
  );
};

export default UploadTab;
