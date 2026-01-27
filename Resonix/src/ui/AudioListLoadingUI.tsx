import { FC } from 'react';
import { View, StyleSheet } from 'react-native';

import PulseAnimationContainer from './PulseAnimationContainer';
import colors from '@utils/colors';

interface Props {
  items?: number;
}

const AudioListLoadingUI: FC<Props> = ({ items = 11 }) => {

  const dummyData = new Array(items).fill('');

  return (
    <PulseAnimationContainer>
      <View>
        {dummyData.map((_, index) => (
          <View key={index} style={styles.dummyListItem}/>
        ))}
      </View>
    </PulseAnimationContainer>
  );
};

const styles = StyleSheet.create({
  dummyListItem: {
    height: 50,
    width: '100%',
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: colors.INACTIVE_CONTRAST,
    borderBottomWidth: 0.8,
    borderBottomColor: colors.SECONDARY,
  }
});

export default AudioListLoadingUI;
