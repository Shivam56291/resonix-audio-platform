import { FC } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import { getPlayerState } from 'store/player';
import colors from 'utils/colors';
import AppModal from './AppModal';
import { AudioData } from 'src/@types/audio';
import AudioListItem from './AudioListItem';
import AudioListLoadingUI from './AudioListLoadingUI';

interface Props {
  data?: AudioData[];
  header?: string;
  visible: boolean;
  onRequestClose: () => void;
  loading?: boolean;
  onItemPress: (item: AudioData, data: AudioData[]) => void;
}

const AudioListModal: FC<Props> = ({
  header,
  onRequestClose,
  data,
  visible,
  loading,
  onItemPress,
}) => {
  const { onGoingAudio } = useSelector(getPlayerState);
  return (
    <AppModal visible={visible} onRequestClose={onRequestClose}>
      <View style={styles.headerContainer}>
        {loading ? (
          <AudioListLoadingUI />
        ) : (
          <>
            <Text style={styles.header}>{header}</Text>

            <FlatList
              data={data || []}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <AudioListItem
                  audio={item}
                  onPress={() => onItemPress(item, data || [])}
                  isPlaying={onGoingAudio?.id === item.id}
                />
              )}
            />
          </>
        )}
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
