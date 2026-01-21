import { FC, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

import colors from '@utils/colors';

const TermsCheckbox: FC<{ onToggle?: (checked: boolean) => void }> = ({ onToggle }) => {
  const [checked, setChecked] = useState(false);

  const toggle = () => {
    setChecked(!checked);
    onToggle?.(!checked);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggle} style={styles.checkboxContainer}>
        <View style={[styles.checkbox, checked && styles.checkboxChecked]} />
      </TouchableOpacity>
      <Text style={styles.text}>
        By signing up, you agree to our{' '}
        <Text
          style={styles.link}
          onPress={() => Linking.openURL('https://example.com/terms')}
        >
          Terms
        </Text>{' '}
        &{' '}
        <Text
          style={styles.link}
          onPress={() => Linking.openURL('https://example.com/privacy')}
        >
          Privacy Policy
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxContainer: {
    marginRight: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.SECONDARY,
    borderRadius: 4,
  },
  checkboxChecked: {
    backgroundColor: colors.SECONDARY,
  },
  text: {
    color: colors.CONTRAST,
    flexShrink: 1,
  },
  link: {
    color: colors.SECONDARY,
    textDecorationLine: 'underline',
  },
});

export default TermsCheckbox;
