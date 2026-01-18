import { FC } from 'react';
import {
  View,
  StyleSheet,
  Text,
  StyleProp,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { useFormikContext } from 'formik';

import AppInput from '@ui/AppInput';
import colors from '@utils/colors';

interface AuthInputFieldProps {
  name: string;
  placeholder?: string;
  label?: string;
  keyboardType?: TextInputProps['keyboardType'];
  returnKeyType?: TextInputProps['returnKeyType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  secureTextEntry?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

const AuthInputField: FC<AuthInputFieldProps> = props => {
  const { values, handleChange, errors, handleBlur, touched } =
    useFormikContext<{
      [key: string]: string;
    }>();

  const {
    placeholder,
    label,
    keyboardType,
    returnKeyType,
    autoCapitalize,
    secureTextEntry,
    containerStyle,
    name,
  } = props;

  const errorMsg = touched[name] && errors[name] ? errors[name] : '';

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {errorMsg && <Text style={styles.errorMsg}>{errorMsg}</Text>}
      </View>
      <AppInput
        placeholder={placeholder}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        onChangeText={handleChange(name)}
        value={values[name]}
        onBlur={handleBlur(name)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  label: {
    color: colors.CONTRAST,
    fontSize: 16,
    fontWeight: '500',
  },
  errorMsg: {
    color: colors.ERROR,
    fontSize: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
  },
});

export default AuthInputField;
