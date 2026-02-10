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
      {isPlayerReady && (
        <View style={styles.miniPlayerWrapper}>
          <MiniAudiPlayer />
        </View>
      )}
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
  miniPlayerWrapper: {
    position: 'absolute',
    bottom: -0.1,
    left: 0,
    right: 0,
  },
});

export default AppView;
