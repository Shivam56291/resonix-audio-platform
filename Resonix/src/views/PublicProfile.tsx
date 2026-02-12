import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FC } from 'react';
import { Text, View } from 'react-native';
import { HomeNavigatorStackParamList } from 'src/@types/navigation';

type Props = NativeStackScreenProps<HomeNavigatorStackParamList, 'PublicProfile'>

const PublicProfile: FC<Props> = ({ route }) => {
  const { profileId } = route.params;
  return (
    <View>
      <Text style={{ color: 'white' }}>PublicProfile {profileId}</Text>
    </View>
  );
};

export default PublicProfile;