import { FC, useState } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import LatestUploads from 'src/components/LatestUploads';
import RecommendedAudio from 'src/components/RecommendedAudio';
import OptionsModal from 'src/components/OptionsModal';
import colors from 'utils/colors';

interface Props {}

const Home: FC<Props> = () => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <View style={styles.container}>
      <LatestUploads
        onAudioPress={item => {
          console.log(item);
        }}
        onAudioLongPress={() => {
          setShowOptions(true);
        }}
      />
      <RecommendedAudio
        onAudioPress={item => {
          console.log(item);
        }}
        onAudioLongPress={() => {
          setShowOptions(true);
        }}
      />
      <OptionsModal
        visible={showOptions}
        onRequestClose={() => setShowOptions(false)}
        options={[
          { title: 'Add to Playlist', icon: 'playlist-plus' }, // 'playlist-music'
          { title: 'Add to Favourites', icon: 'heart-plus' }, // 'cards-heart'
        ]}
        renderItem={item => (
          <Pressable
            style={styles.optionContainer}
            onPress={() => setShowOptions(false)}
          >
            <MaterialCommunityIcons
              name={item.icon}
              size={24}
              color={colors.PRIMARY}
            />
            <Text style={styles.optionLabel}>{item.title}</Text>
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  optionContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
  },
  optionLabel: {
    color: colors.PRIMARY,
    fontSize: 16,
    marginLeft: 7,
  },
});

export default Home;
