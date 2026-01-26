import { FC, useState } from 'react';
import { TextInput, View, StyleSheet, Pressable, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import BasicModalContainer from 'ui/BasicModalContainer';
import colors from 'utils/colors';

export interface PlaylistInfo {
  title: string;
  private: boolean;
}

interface Props {
  visible: boolean;
  onRequestClose: () => void;
  onSubmit: (value: PlaylistInfo) => void;
}

const PlaylistForm: FC<Props> = ({ visible, onRequestClose, onSubmit }) => {
  const [playlistInfo, setPlaylistInfo] = useState({
    title: '',
    private: false,
  });

  const handleSubmit = () => {
    onSubmit(playlistInfo);
    handleClose();
  };

  const handleClose = () => {
    onRequestClose();
    setPlaylistInfo({
      title: '',
      private: false,
    });
  };

  return (
    <BasicModalContainer visible={visible} onRequestClose={handleClose}>
      <View>
        <Text style={styles.title}>Create New Playlist</Text>
        <TextInput
          onChangeText={text =>
            setPlaylistInfo({ ...playlistInfo, title: text })
          }
          placeholder="Title"
          style={styles.input}
          value={playlistInfo.title}
        />
        <Pressable
          onPress={() =>
            setPlaylistInfo({ ...playlistInfo, private: !playlistInfo.private })
          }
          style={styles.privateSelector}
        >
          {playlistInfo.private ? (
            <MaterialCommunityIcons
              name="radiobox-marked"
              size={20}
              color={colors.PRIMARY}
            />
          ) : (
            <MaterialCommunityIcons
              name="radiobox-blank"
              size={20}
              color={colors.PRIMARY}
            />
          )}
          <Text style={styles.privateSelectorLabel}>Private</Text>
        </Pressable>
        <Pressable onPress={handleSubmit} style={styles.submitBtn}>
          <Text>Create</Text>
        </Pressable>
      </View>
    </BasicModalContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.PRIMARY,
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 2,
    height: 45,
    paddingVertical: 10,
    borderBottomColor: colors.PRIMARY,
    color: colors.PRIMARY,
    fontSize: 16,
  },
  privateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
  },
  privateSelectorLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: colors.PRIMARY,
  },
  submitBtn: {
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.PRIMARY,
    borderRadius: 7,
  },
});

export default PlaylistForm;
