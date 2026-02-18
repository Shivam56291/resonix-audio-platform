import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppModal from 'ui/AppModal';
import {
  getPlaylistModalState,
  updatePlaylistVisibility,
} from 'store/playlistModal';
import { useFetchPlaylistAudios } from 'hooks/query';
import { FlatList } from 'react-native';
import AudioListItem from 'ui/AudioListItem';

interface Props {
}

const PlaylistAudioModal: FC<Props> = () => {
  const { visible, selectedListId } = useSelector(getPlaylistModalState);
  const dispatch = useDispatch();

  const { data } = useFetchPlaylistAudios(selectedListId || '');

  console.log("selectedListId : ", selectedListId)
  console.log(data);

  const handleClose = () => {
    dispatch(updatePlaylistVisibility(false));
  };

  return (
    <AppModal visible={visible} onRequestClose={handleClose}>
      <FlatList
        data={data?.audios}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <AudioListItem audio={item} />}
      />
    </AppModal>
  );
};

export default PlaylistAudioModal;
