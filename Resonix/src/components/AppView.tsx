import { FC, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import MiniAudiPlayer from './MiniAudioPlayer';
import useAudioController from 'hooks/useAudioController';

interface Props {
  children: ReactNode;
}

const AppView: FC<Props> = ({ children }) => {
  const { isPlayerReady } = useAudioController();

  return (
    <View style={styles.container}>
      <View style={styles.children}>{children}</View>
      {isPlayerReady && <MiniAudiPlayer />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  children: {
    flex: 1,
  },
});

export default AppView;
