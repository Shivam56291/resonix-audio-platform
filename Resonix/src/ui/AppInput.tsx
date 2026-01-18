import React, { FC } from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import colors from '@utils/colors';

interface AppInputProps extends TextInputProps {}

const AppInput: FC<AppInputProps> = props => {
  return (
    <TextInput
      {...props}
      placeholderTextColor={
        props.placeholderTextColor || colors.INACTIVE_CONTRAST
      }
      style={[styles.input, props.style]}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 2,
    borderColor: colors.SECONDARY,
    height: 45,
    borderRadius: 23,
    color: colors.CONTRAST,
    padding: 10,
  },
});

export default AppInput;
