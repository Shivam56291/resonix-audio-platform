import { FC } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import colors from 'utils/colors';
import AppModal from './AppModal';
import { AudioData } from 'src/@types/audio';
import AudioListItem from './AudioListItem';

interface Props {
  data?: AudioData[];
  header?: string;
  visible: boolean;
  onRequestClose: () => void;
}

const AudioListModal: FC<Props> = ({
  header,
  onRequestClose,
  data,
  visible,
}) => {
  return (
    <AppModal visible={visible} onRequestClose={onRequestClose}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>{header}</Text>

        <FlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <AudioListItem audio={item}/>
          )}
        />
      </View>
    </AppModal>
  );
};
const styles = StyleSheet.create({
  headerContainer: {
    padding: 10,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.CONTRAST,
    paddingVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.CONTRAST,
    marginRight: 30,
    marginBottom: 10,
  },
});

export default AudioListModal;
