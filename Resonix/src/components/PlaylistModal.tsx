import { FC, ReactNode } from 'react';
import { Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import BasicModalContainer from 'ui/BasicModalContainer';
import colors from 'utils/colors';
import { Playlist } from 'src/@types/audio';

interface Props {
  visible: boolean;
  onRequestClose: () => void;
  list: Playlist[];
  onCreateNewPress: () => void;
  onPlaylistPress: (playlist: Playlist) => void;
}

const ListItem = ({
  title,
  icon,
  onPress,
}: {
  title: string;
  icon: ReactNode;
  onPress?: () => void;
}) => {
  return (
    <Pressable style={styles.listItemContainer} onPress={onPress}>
      {icon}
    <Text style={styles.listItemLabel}>{title}</Text>
    </Pressable>
  );
};

const PlaylistModal: FC<Props> = ({ visible, onRequestClose, list, onCreateNewPress, onPlaylistPress }) => {
  return (
    <BasicModalContainer visible={visible} onRequestClose={onRequestClose}>
      <ScrollView>
        {list.map(item => {
          return (
            <ListItem
              key={item.id}
              title={item.title}
              icon={
                <FontAwesome
                  style={item.visibility === 'public' ? {} : {marginLeft: 3}}
                  name={item.visibility === 'public' ? 'globe' : 'lock'}
                  size={item.visibility === 'public' ? 19 : 20}
                  color={colors.PRIMARY}
                />
              }
              onPress={() => onPlaylistPress(item)}
            />
          );
        })}
      </ScrollView>

      <ListItem
        title="Create New Playlist"
        icon={<FontAwesome5 name="plus" size={19} color={colors.PRIMARY} />}
        onPress={onCreateNewPress}
      />
    </BasicModalContainer>
  );
};

const styles = StyleSheet.create({
  listItemContainer: { flexDirection: 'row', alignItems: 'center', height: 45 },
  listItemLabel: { fontSize: 16, color: colors.PRIMARY, marginLeft: 15 },
});

export default PlaylistModal;
