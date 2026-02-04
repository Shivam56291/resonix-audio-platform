import { FC } from 'react';
import AudioListModal from '@ui/AudioListModal';
import { useSelector } from 'react-redux';

import { getPlayerState } from 'store/player';
import useAudioController from 'hooks/useAudioController';

interface Props {
  visible: boolean;
  onRequestClose: () => void;
}

const CurrentAudioList: FC<Props> = ({ visible, onRequestClose }) => {
  const { onGoingList } = useSelector(getPlayerState);
  const {onAudioPress} = useAudioController()

  return (
    <AudioListModal
      header="Current Audio List"
      visible={visible}
      onRequestClose={onRequestClose}
      data={onGoingList}
      loading={onGoingList.length === 0}
      onItemPress={onAudioPress}
    />
  );
};

export default CurrentAudioList;
