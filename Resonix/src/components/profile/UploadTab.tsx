import { FC } from 'react';
import { ScrollView } from 'react-native';
import { useFetchUploadsByProfile } from 'src/hooks/query';
import AudioListItem from '@ui/AudioListItem';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import EmptyRecords from '@ui/EmptyRecords';

interface Props {}

const UploadTab: FC<Props> = () => {
  const { data = [], isLoading } = useFetchUploadsByProfile();

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
        <EmptyRecords title="No Uploads Found!" />
      )}
    </ScrollView>
  );
};

export default UploadTab;
