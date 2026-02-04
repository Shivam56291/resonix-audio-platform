import { FC } from 'react';
import AudioListModal from '@ui/AudioListModal';
import { useSelector } from 'react-redux';

import { getPlayerState } from 'store/player';

interface Props {
  visible: boolean;
  onRequestClose: () => void;
}

const CurrentAudioList: FC<Props> = ({ visible, onRequestClose }) => {

  const {onGoingList} = useSelector(getPlayerState)

  return <AudioListModal header="Current Audio List" visible={visible} onRequestClose={onRequestClose} data={onGoingList}/>
};

export default CurrentAudioList;
