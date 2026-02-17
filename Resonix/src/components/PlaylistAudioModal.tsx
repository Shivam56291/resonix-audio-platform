import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppModal from 'ui/AppModal';
import {
  getPlaylistModalState,
  updatePlaylistVisibility,
} from 'store/playlistModal';

interface Props {
  children: React.ReactNode;
}

const PlaylistAudioModal: FC<Props> = ({ children }) => {
  const { visible } = useSelector(getPlaylistModalState);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(updatePlaylistVisibility(false));
  };

  return (
    <AppModal visible={visible} onRequestClose={handleClose}>
      {children}
    </AppModal>
  );
};

export default PlaylistAudioModal;
