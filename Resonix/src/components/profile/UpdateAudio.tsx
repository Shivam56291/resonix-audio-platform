import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileNavigatorStackParamList } from 'src/@types/navigation';
import { FC } from 'react';
import AudioForm from 'components/form/AudioForm';

type Props = NativeStackScreenProps<
  ProfileNavigatorStackParamList,
  'UpdateAudio'
>;

const UpdateAudio: FC<Props> = ({ route }) => {
  const { audio } = route.params;
  return (
    <AudioForm
      initialValues={{
        title: audio.title,
        about: audio.about,
        category: audio.category,
      }}
      onSubmit={data => {
        console.log(data);
      }}
    />
  );
};

export default UpdateAudio;
