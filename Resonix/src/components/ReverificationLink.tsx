import { FC, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Text, View, StyleSheet } from 'react-native';
import AppLink from '@ui/AppLink';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import colors from '@utils/colors';
import { getClient } from 'api/client';
import { getAuthState } from 'store/auth';
import { updateNotification } from 'store/notification';
import catchAsyncError from 'api/catchError';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { ProfileNavigatorStackParamList } from 'src/@types/navigation';

interface Props {
  isVerified?: boolean;
  linkTitle: string;
  activeAtFirst?: boolean;
  userId?: string;
  time?: number;
}

const ReverificationLink: FC<Props> = ({
  time = 60,
  linkTitle = 'Re-send OTP',
  activeAtFirst = false,
  userId,
  isVerified = false,
}) => {
  const dispatch = useDispatch();
  const [countDown, setCountDown] = useState(time);
  const [canSendNewOtpRequest, setCanSendNewOtpRequest] =
    useState(activeAtFirst);
  const { navigate } =
    useNavigation<NavigationProp<ProfileNavigatorStackParamList>>();

  const { profile } = useSelector(getAuthState);

  const handleResendOTP = async () => {
    setCountDown(60);
    setCanSendNewOtpRequest(false);
    try {
      const client = await getClient();
      await client.post('/auth/re-verify-email', {
        userId: userId || profile?.id,
      });
      dispatch(
        updateNotification({
          message: 'New OTP sent successfully',
          type: 'success',
        }),
      );

      navigate('Verification', {
        userInfo: {
          email: profile?.email || '',
          user: userId || profile?.id || '',
          name: profile?.name || '',
        },
        redirectTo: 'ProfileSettings',
      });
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(updateNotification({ message: errorMessage, type: 'error' }));
    }
  };

  useEffect(() => {
    if (canSendNewOtpRequest) return;

    const intervalId = setInterval(() => {
      setCountDown(prev => {
        if (prev <= 1) {
          setCanSendNewOtpRequest(true);
          clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [canSendNewOtpRequest]);
  
  if (isVerified) {
    return <MaterialIcon name="verified" size={20} color={colors.SECONDARY} />;
  }

  return (
    <View style={styles.linksContainer}>
      {countDown > 0 && !canSendNewOtpRequest && (
        <Text style={styles.countDown}>{countDown} sec</Text>
      )}
      <AppLink
        active={canSendNewOtpRequest}
        title={linkTitle}
        onPress={handleResendOTP}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  linksContainer: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  countDown: {
    fontSize: 16,
    color: colors.SECONDARY,
  },
});

export default ReverificationLink;
