import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileNavigatorStackParamList } from 'src/@types/navigation';
import { FC, useState } from 'react';
import AudioForm from 'components/form/AudioForm';
import { useDispatch } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { getClient } from 'api/client';
import { mapRange } from 'utils/math';
import { updateNotification } from 'store/notification';
import catchAsyncError from 'api/catchError';
import { NavigationProp, useNavigation } from '@react-navigation/native';

type Props = NativeStackScreenProps<
  ProfileNavigatorStackParamList,
  'UpdateAudio'
>;

const UpdateAudio: FC<Props> = ({ route }) => {
  const { audio } = route.params;
  const [uploadProgress, setUploadProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const dispatch = useDispatch();
  const { navigate } =
    useNavigation<NavigationProp<ProfileNavigatorStackParamList>>();
  const queryClient = useQueryClient();

  const handleUpdate = async (formData: FormData) => {
    setUploadProgress(0);

    setTimeout(() => {
      setBusy(true);
    }, 120);
    try {
      const client = await getClient({
        'Content-Type': 'multipart/form-data',
      });

      await client.patch(`/audio/${audio.id}`, formData, {
        onUploadProgress: progressEvent => {
          const progress = mapRange({
            inputValue: progressEvent.loaded,
            outputMin: 0,
            outputMax: 100,
            inputMax: progressEvent.total || 1,
            inputMin: 0,
          });
          setUploadProgress(Math.floor(progress));
        },
      });
      dispatch(
        updateNotification({
          message: 'Audio updated successfully',
          type: 'success',
        }),
      );
      setUploadProgress(100);
      setBusy(false);

      queryClient.invalidateQueries({ queryKey: ['latest-uploads'] });
      queryClient.invalidateQueries({ queryKey: ['recommended'] });
      queryClient.invalidateQueries({ queryKey: ['uploads-by-profile'] });
      navigate('Profile');
    } catch (error: any) {
      const errorMessage = catchAsyncError(error);
      dispatch(updateNotification({ message: errorMessage, type: 'error' }));
      setBusy(false);
      setUploadProgress(0);
    }
  };
  return (
    <AudioForm
      initialValues={{
        title: audio.title,
        about: audio.about,
        category: audio.category,
      }}
      onSubmit={handleUpdate}
      busy={busy}
      progress={uploadProgress}
    />
  );
};

export default UpdateAudio;
