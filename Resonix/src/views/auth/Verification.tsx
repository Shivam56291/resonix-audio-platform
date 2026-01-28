import { FC, useEffect, useRef, useState } from 'react';
import { Keyboard, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import colors from '@utils/colors';
import AuthFormContainer from '@components/form/AuthFormContainer';
import OTPField from '@views/auth/OTPField';
import AppButton from '@ui/AppButton';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
  AuthStackParamList,
  ProfileNavigatorStackParamList,
} from 'src/@types/navigation';
import client from 'src/api/client';
import catchAsyncError from 'src/api/catchError';
import { updateNotification } from 'src/store/notification';
import ReverificationLink from 'components/ReverificationLink';

const OTP_LENGTH = 6;

type Props = NativeStackScreenProps<
  AuthStackParamList | ProfileNavigatorStackParamList,
  'Verification'
>;

type VerificationNavProp = NativeStackNavigationProp<
  AuthStackParamList & ProfileNavigatorStackParamList
>;

const Verification: FC<Props> = props => {
  const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(''));
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation<VerificationNavProp>();

  const { userInfo, redirectTo } = props.route.params;

  useEffect(() => {
    const timeout = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 50);
    return () => clearTimeout(timeout);
  }, []);

  const handleChangeText = (text: string, index: number) => {
    const newOtp = [...otp];

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

  const isValidOtp = otp.every(digit => {
    return digit.trim() !== '';
  });

  const handleOTPSubmit = async () => {
    if (!isValidOtp)
      return dispatch(
        updateNotification({
          message: 'Please enter a valid OTP',
          type: 'error',
        }),
      );
    try {
      setIsSubmitting(true);
      await client.post('/auth/verify-email', {
        userId: userInfo.user,
        token: otp.join(''),
      });
      dispatch(
        updateNotification({
          message: 'Your email is verified successfully',
          type: 'success',
        }),
      );

      // const{routeNames} = navigation.getState();

      // if (routeNames.includes('SignIn')) {
      //   navigation.replace('SignIn');
      // }
      // if(routeNames.includes('ProfileSettings')) {
      //   navigation.replace('ProfileSettings');
      // }

      navigation.replace(redirectTo);
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(updateNotification({ message: errorMessage, type: 'error' }));
    } finally {
      setIsSubmitting(false);
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

          <AppButton
            title="Submit"
            onPress={handleOTPSubmit}
            busy={isSubmitting}
            disabled={isSubmitting}
          />

          <View style={styles.linksContainer}>
            <ReverificationLink
              linkTitle="Re-send OTP"
              userId={userInfo.user}
            />
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
  countDown: {
    color: colors.SECONDARY,
    marginRight: 10,
  },
});

export default Verification;
