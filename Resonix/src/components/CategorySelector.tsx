import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { ReactNode, useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '@utils/colors';
import BasicModalContainer from 'ui/BasicModalContainer';

interface Props<T> {
  data: readonly T[];
  visible: boolean;
  title?: string;
  renderItem: (item: T) => ReactNode;
  onSelect?: (item: T, index: number) => void;
  onRequestClose: () => void;
}

const CategorySelector = <T extends any>({
  data = [],
  visible,
  title,
  renderItem,
  onSelect,
  onRequestClose,
}: Props<T>) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSelect = (item: T, index: number) => {
    setSelectedIndex(index);
    onSelect?.(item, index);
    onRequestClose();
  };

  return (
    <BasicModalContainer visible={visible} onRequestClose={onRequestClose}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView>
        {data.map((item, index) => (
          <Pressable
            android_ripple={{ color: colors.SECONDARY }}
            onPress={() => handleSelect(item, index)}
            key={index}
            style={({ pressed }) => [
              styles.selectorContainer,
              pressed && styles.pressed,
            ]}
          >
            {selectedIndex === index ? (
              <MaterialCommunityIcons
                name="radiobox-marked"
                color={colors.SECONDARY}
              />
            ) : (
              <MaterialCommunityIcons
                name="radiobox-blank"
                color={colors.SECONDARY}
              />
            )}
            {renderItem(item)}
          </Pressable>
        ))}
      </ScrollView>
    </BasicModalContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.PRIMARY,
    paddingVertical: 10,
  },
  selectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    overflow: 'hidden',
  },
  pressed: {
    backgroundColor: colors.SECONDARY + '40',
    borderRadius: 6,
  },
});

export default CategorySelector;
