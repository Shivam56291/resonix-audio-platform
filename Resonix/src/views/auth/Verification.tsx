import { FC, useEffect, useRef, useState } from 'react';
import { Keyboard, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import colors from '@utils/colors';
import AppLink from '@ui/AppLink';
import AuthFormContainer from '@components/form/AuthFormContainer';
import OTPField from '@views/auth/OTPField';
import AppButton from '@ui/AppButton';

const OTP_LENGTH = 6;

const Verification: FC = () => {
  const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(''));
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 50);
    return () => clearTimeout(timeout);
  }, []);

  const handleChangeText = (text: string, index: number) => {
    const newOtp = [...otp];

    // if (text.length === 6) {
    //   const digits = text
    //     .replace(/\D/g, '') // keep only numbers
    //     .slice(0, OTP_LENGTH - index)
    //     .split('');

    //   digits.forEach((digit, i) => {
    //     newOtp[index + i] = digit;
    //   });

    //   setOtp(newOtp);

    //   const nextIndex = Math.min(index + digits.length - 1, OTP_LENGTH - 1);
    //   inputRefs.current[nextIndex]?.focus();
    //   return;
    // }

    if (text.length === 6) {
      Keyboard.dismiss();
      const newOtp = text.split('');
      setOtp(newOtp);
    }

    if (otp[index] && text.length === 1) {
      return;
    }

    if (text.length === 1) {
      newOtp[index] = text;
      setOtp(newOtp);

      if (index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
      if (index === OTP_LENGTH - 1) {
      }
    } else if (text === '') {
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = ''; // Clear previous digit
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus(); // Move focus back
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AuthFormContainer
        heading="Verify OTP"
        subHeading="Enter the OTP sent to your email address"
      >
        <View style={styles.formContainer}>
          <View style={styles.otpContainer}>
            {otp.map((value, index) => (
              <OTPField
                key={index}
                // Store ref in array
                ref={ref => {
                  inputRefs.current[index] = ref;
                }}
                value={otp[index] || ''}
                placeholder="*"
                // Events
                onChangeText={text => handleChangeText(text, index)}
                onKeyPress={({ nativeEvent }) =>
                  handleKeyPress(nativeEvent.key, index)
                }
              />
            ))}
          </View>

          <AppButton title="Submit" onPress={() =>{}} />

          <View style={styles.linksContainer}>
            <AppLink title="Re-send OTP" />
          </View>
        </View>
      </AuthFormContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.PRIMARY,
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 25,
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    paddingHorizontal: 15,
    gap: 12,
  },
  otpContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 25,
    marginBottom: 20,
  },
});

export default Verification;
