import { forwardRef } from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import colors from '@utils/colors';

interface Props extends TextInputProps {}

const OTPField = forwardRef<TextInput, Props>((props, ref) => {
  return (
    <TextInput
      ref={ref}
      {...props}
      textContentType="oneTimeCode"
      keyboardType="number-pad"
      selectTextOnFocus={true}
      style={[styles.input, props.style]}
      placeholderTextColor={colors.INACTIVE_CONTRAST}
    />
  );
});

const styles = StyleSheet.create({
  input: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: colors.SECONDARY,
    borderRadius: 25,
    textAlign: 'center',
    color: colors.CONTRAST,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OTPField;
