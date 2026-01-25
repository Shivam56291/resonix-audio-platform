import { ReactNode } from 'react';
import { View } from 'react-native';

import BasicModalContainer from 'ui/BasicModalContainer';

interface Props<T> {
  visible: boolean;
  onRequestClose: () => void;
  options: T[];
  renderItem: (item: T) => ReactNode;
}

const OptionsModal = <T extends any>({
  visible,
  onRequestClose,
  options,
  renderItem,
}: Props<T>) => {
  return (
    <BasicModalContainer visible={visible} onRequestClose={onRequestClose}>
      {options.map((item, index) => {
        return <View key={index}>{renderItem(item)}</View>;
      })}
    </BasicModalContainer>
  );
};

export default OptionsModal;
