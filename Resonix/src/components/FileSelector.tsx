import {
  Text,
  Pressable,
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { FC, ReactNode } from 'react';
import * as DocumentPicker from '@react-native-documents/picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../utils/colors';

interface Props {
  title: string;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  onSelect?: (file: DocumentPicker.DocumentPickerResponse) => void;
  options: DocumentPicker.DocumentPickerOptions;
  file?: DocumentPicker.DocumentPickerResponse;
}

const FileSelector: FC<Props> = ({
  title,
  icon,
  style,
  onSelect,
  options,
  file,
}) => {
  const handleDocumentSelect = async () => {
    try {
      const result = await DocumentPicker.pick(options);
      onSelect?.(result[0]);
    } catch (err: any) {
      if (err?.message?.toLowerCase().includes('user canceled')) {
        return;
      }
      console.error('DocumentPicker error:', err);
    }
  };

  return (
    <Pressable
      onPress={handleDocumentSelect}
      style={({ pressed }) => [
        styles.btnContainer,
        pressed && styles.pressed,
        style,
      ]}
    >
      <View style={styles.iconContainer}>
        {file ? (
          <MaterialCommunityIcons
            name="check-circle"
            size={36}
            color={colors.SUCCESS}
          />
        ) : (
          icon
        )}
      </View>

      <Text style={styles.btnTitle}>{file ? 'Selected' : title}</Text>

      {/* 👇 ALWAYS RENDER — reserve height */}
      <Text style={styles.fileName} numberOfLines={1}>
        {file?.name || ' '}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: 90, // ✅ fixed width
    height: 135, // ✅ fixed height (prevents jump)
  },

  iconContainer: {
    width: 70,
    height: 70,
    borderWidth: 2,
    borderColor: colors.SECONDARY,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnTitle: {
    color: colors.CONTRAST,
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 6,
  },

  fileName: {
    marginTop: 4,
    fontSize: 12,
    color: colors.INACTIVE_CONTRAST,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});

export default FileSelector;
