import { FC, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as DocumentPicker from '@react-native-documents/picker';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';

import colors from '@utils/colors';
import FileSelector from '@components/FileSelector';
import AppButton from '@ui/AppButton';
import CategorySelector from '@components/CategorySelector';
import { categories } from '@utils/categories';
import { getClient } from 'src/api/client';
import Progress from '@ui/Progress';
import { mapRange } from '@utils/math';
import { updateNotification } from 'src/store/notification';
import catchAsyncError from 'src/api/catchError';
import { BlurView } from '@react-native-community/blur';
import AppView from 'components/AppView';

interface FormFields {
  title: string;
  category: string;
  about: string;
  file?: DocumentPicker.DocumentPickerResponse;
  poster?: DocumentPicker.DocumentPickerResponse;
}

const defaultForm: FormFields = {
  title: '',
  category: '',
  about: '',
  file: undefined,
  poster: undefined,
};

const audioInfoSchema = yup.object({
  title: yup.string().trim().required('Title is required'),
  category: yup
    .string()
    .oneOf(categories, 'Category is missing')
    .required('Category is required'),

  about: yup.string().trim().required('About is required'),
  file: yup
    .object()
    .shape({
      name: yup.string().required('Audio file name is required'),
      type: yup.string().required('Audio file type is required'),
      uri: yup.string().required('Audio file uri is required'),
      size: yup.number().required('Audio file size is required'),
    })
    .required('Audio file is required'),
  poster: yup.object().shape({
    name: yup.string(),
    type: yup.string(),
    uri: yup.string(),
    size: yup.number(),
  }),
});

interface Props {}

const Upload: FC<Props> = () => {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [audioInfo, setAudioInfo] = useState({ ...defaultForm });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  const handleUpload = async () => {
    setUploadProgress(0);

    setTimeout(() => {
      setBusy(true);
    }, 120);
    try {
      const data = await audioInfoSchema.validate(audioInfo);
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('category', data.category);
      formData.append('about', data.about);

      formData.append('file', {
        name: data.file.name,
        type: data.file.type,
        uri: data.file.uri,
      } as any);

      if (data.poster?.uri) {
        formData.append('poster', {
          name: data.poster.name,
          type: data.poster.type,
          uri: data.poster.uri,
        } as any);
      }

      const client = await getClient({
        'Content-Type': 'multipart/form-data',
      });

      await client.post('/audio/create', formData, {
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
          message: 'Audio uploaded successfully',
          type: 'success',
        }),
      );
      setUploadProgress(100);
      setAudioInfo({ ...defaultForm });
      setBusy(false);

      queryClient.invalidateQueries({ queryKey: ['latest-uploads'] });
      queryClient.invalidateQueries({ queryKey: ['recommended'] });
    } catch (error: any) {
      const errorMessage = catchAsyncError(error);
      dispatch(updateNotification({ message: errorMessage, type: 'error' }));
      setBusy(false);
      setUploadProgress(0);
    }
  };

  return (
    <AppView>
      <View style={{ flex: 1, position: 'relative' }}>
        <ScrollView
          style={styles.container}
          scrollEnabled={!busy}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.fileSelectorContainer}>
            <FileSelector
              icon={
                <MaterialCommunityIcons
                  name="image-outline"
                  size={35}
                  color={colors.SECONDARY}
                />
              }
              title="Select Poster"
              options={{
                type: [DocumentPicker.types.images],
              }}
              onSelect={files => {
                setAudioInfo({ ...audioInfo, poster: files });
              }}
              file={audioInfo.poster}
            />
            <FileSelector
              icon={
                <MaterialCommunityIcons
                  name="file-music-outline"
                  size={35}
                  color={colors.SECONDARY}
                />
              }
              title="Select Audio"
              options={{
                type: [DocumentPicker.types.audio],
              }}
              onSelect={files => {
                setAudioInfo({ ...audioInfo, file: files });
              }}
              file={audioInfo.file}
            />
          </View>
          <View style={styles.formContainer}>
            <TextInput
              placeholder="Title"
              placeholderTextColor={colors.INACTIVE_CONTRAST}
              style={[styles.input, { marginBottom: 10 }]}
              onChangeText={title => setAudioInfo({ ...audioInfo, title })}
              value={audioInfo.title}
            />

            <Pressable
              onPress={() => setShowCategoryModal(true)}
              style={({ pressed }) => [
                styles.categorySelector,
                pressed && { opacity: 0.6 },
              ]}
            >
              <Text style={styles.categorySelectorTitle}>Category</Text>
              <Text style={styles.selectedCategory}>
                {audioInfo.category || 'Select Category'}
              </Text>
            </Pressable>

            <TextInput
              placeholder="About"
              placeholderTextColor={colors.INACTIVE_CONTRAST}
              style={[styles.input, { marginTop: 10 }]}
              multiline
              numberOfLines={5}
              onChangeText={about => setAudioInfo({ ...audioInfo, about })}
              value={audioInfo.about}
            />

            <CategorySelector
              visible={showCategoryModal}
              title="Category"
              data={categories}
              renderItem={item => <Text style={styles.category}>{item}</Text>}
              onSelect={item => setAudioInfo({ ...audioInfo, category: item })}
              onRequestClose={() => setShowCategoryModal(false)}
            />

            <View style={{ height: 50 }} />

            <AppButton
              busy={busy}
              title="Upload"
              borderRadius={7}
              onPress={handleUpload}
            />
          </View>
        </ScrollView>

        {busy && (
          <View style={styles.globalOverlay}>
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType="dark"
              blurAmount={10}
              reducedTransparencyFallbackColor="rgba(0,0,0,0.35)"
            />
            <Progress progress={uploadProgress} />
          </View>
        )}
      </View>
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 14,
  },
  fileSelectorContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
    gap: 30,
  },
  formContainer: {
    marginTop: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.SECONDARY,
    borderRadius: 7,
    padding: 10,
    fontSize: 18,
    color: colors.CONTRAST,
    textAlignVertical: 'top',
  },
  category: {
    padding: 10,
    color: colors.PRIMARY,
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  categorySelectorTitle: {
    color: colors.CONTRAST,
    fontWeight: '700',
  },
  selectedCategory: {
    color: colors.SECONDARY,
    marginLeft: 10,
    fontStyle: 'italic',
  },
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
    marginVertical: 20,
  },
  globalOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
});

export default Upload;
