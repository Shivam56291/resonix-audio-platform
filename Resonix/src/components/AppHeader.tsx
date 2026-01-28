import { FC } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';

import colors from '@utils/colors';
import { useNavigation } from '@react-navigation/native';

interface Props {
  title: string;
}

const AppHeader: FC<Props> = ({ title }) => {
  const { goBack, canGoBack } = useNavigation();

  if (!canGoBack()) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={goBack}
        style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
      >
        <Octicons name="arrow-left" size={26} color={colors.CONTRAST} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.PRIMARY,
    height: 45,
    paddingHorizontal: 10,
  },
  backButton: {
    padding: 3,
  },
  pressed: {
    opacity: 0.5,
  },
  title: {
    color: colors.CONTRAST,
    fontSize: 18,
  },
});

export default AppHeader;
