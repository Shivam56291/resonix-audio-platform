import { FC, ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

import colors from '@utils/colors';
import AppNotification from '@components/AppNotification';

interface Props {
  children: ReactNode;
}

const AppContainer: FC<Props> = ({ children }) => {
  return (
    <SafeAreaView style={styles.container}>
      <AppNotification />
      {children}
    </SafeAreaView>
  );
};

export default AppContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.PRIMARY,
    color: colors.CONTRAST,
  },
});
