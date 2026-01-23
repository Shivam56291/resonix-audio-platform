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

import colors from '@utils/colors';
import FileSelector from '@components/FileSelector';
import AppButton from '@ui/AppButton';
import CategorySelector from '@components/CategorySelector';
import { categories } from '@utils/categories';

interface Props {}

const Upload: FC<Props> = () => {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [audioInfo, setAudioInfo] = useState({
    category: '',
  });

  return (
    <ScrollView style={styles.container}>
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
        />
        <FileSelector
          icon={
            <MaterialCommunityIcons
              name="file-music-outline"
              size={35}
              color={colors.SECONDARY}
            />
          }
          style={{ marginLeft: 20 }}
          title="Select Audio"
        />
      </View>
      <View style={styles.formContainer}>
        <TextInput
          placeholder="Title"
          placeholderTextColor={colors.INACTIVE_CONTRAST}
          style={styles.input}
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
          style={styles.input}
          multiline
          numberOfLines={5}
        />

        <CategorySelector
          visible={showCategoryModal}
          title="Category"
          data={categories}
          renderItem={item => <Text style={styles.category}>{item}</Text>}
          onSelect={item => setAudioInfo({ ...audioInfo, category: item })}
          onRequestClose={() => setShowCategoryModal(false)}
        />

        <View style={{ marginBottom: 20 }} />
        <AppButton title="Upload" borderRadius={7} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 14,
  },
  fileSelectorContainer: {
    flexDirection: 'row',
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
});

export default Upload;
