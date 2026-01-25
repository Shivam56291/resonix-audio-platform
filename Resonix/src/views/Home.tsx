import { FC } from 'react';
import { View, StyleSheet } from 'react-native';

import LatestUploads from 'src/components/LatestUploads';

interface Props {}

const Home: FC<Props> = () => {
  return (
    <View style={styles.container}>
      <LatestUploads />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Home;
