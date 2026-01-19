import { FC } from 'react';
import { Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import colors from '@utils/colors';

interface Props {
  privateIcon: boolean;
  onPress?: () => void;
}

const PasswordVisibilityIcon: FC<Props> = ({ privateIcon, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      style={({ pressed }) => ({
        opacity: pressed ? 0.5 : 1, // reduce opacity when pressed
      })}
    >
      <Icon
        name={privateIcon ? 'eye' : 'eye-with-line'}
        size={20}
        color={colors.SECONDARY}
      />
    </Pressable>
  );
};

export default PasswordVisibilityIcon;
