import { FC, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  StyleProp,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { useFormikContext } from 'formik';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

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
  const inputTransformValue = useSharedValue(0);
  const errorOpacity = useSharedValue(0);

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

  const inputStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: inputTransformValue.value }],
    };
  });
  const errorStyle = useAnimatedStyle(() => ({
    opacity: errorOpacity.value,
  }));

  useEffect(() => {
    if (!errorMsg) return;

    inputTransformValue.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withSpring(0, {
        damping: 8,
        mass: 0.5,
        stiffness: 1000,
      }),
    );
  }, [errorMsg, inputTransformValue]);

  useEffect(() => {
    errorOpacity.value = errorMsg ? withTiming(1) : withTiming(0);
  }, [errorMsg, errorOpacity]);

  return (
    <Animated.View style={[containerStyle, inputStyle]}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {errorMsg && (
          <Animated.Text style={[styles.errorMsg, errorStyle]}>
            {errorMsg}
          </Animated.Text>
        )}
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
    </Animated.View>
  );
};

const styles = StyleSheet.create({
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
