import { FC, useState } from 'react';
import { ScrollView, StyleSheet, Pressable, Text } from 'react-native';
import { useSelector } from 'react-redux';

import { useFetchUploadsByProfile } from 'src/hooks/query';
import AudioListItem from '@ui/AudioListItem';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import EmptyRecords from '@ui/EmptyRecords';
import useAudioController from 'hooks/useAudioController';

import { getPlayerState } from 'store/player';
import { AudioData } from 'src/@types/audio';
import colors from '@utils/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import OptionsModal from 'components/OptionsModal';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ProfileNavigatorStackParamList } from 'src/@types/navigation';

interface Props {}

const UploadTab: FC<Props> = () => {
  const { onGoingAudio } = useSelector(getPlayerState);
  const { data = [], isLoading } = useFetchUploadsByProfile();
  const { onAudioPress } = useAudioController();
  const [showOptions, setShowOptions] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<AudioData>();
  const { navigate } =
    useNavigation<NavigationProp<ProfileNavigatorStackParamList>>();

  const handleOnLongPress = (audio: AudioData) => {
    setSelectedAudio(audio);
    setShowOptions(true);
  };

  const handleOnEditPress = () => {
    setShowOptions(false);
    if (!selectedAudio) return;
    navigate('UpdateAudio', { audio: selectedAudio });
  };

  if (isLoading) {
    return <AudioListLoadingUI items={data.length || 11} />;
  }

  return (
    <>
      <ScrollView>
        {data.length > 0 ? (
          data.map(audio => (
            <AudioListItem
              onPress={() => onAudioPress(audio, data)}
              onLongPress={() => handleOnLongPress(audio)}
              key={audio.id}
              audio={audio}
              isPlaying={onGoingAudio?.id === audio.id}
            />
          ))
        ) : (
          <EmptyRecords title="No Uploads Found!" />
        )}
      </ScrollView>
      <OptionsModal
        visible={showOptions}
        onRequestClose={() => setShowOptions(false)}
        options={[
          {
            title: 'Edit',
            icon: 'edit', // 'playlist-plus
            onPress: handleOnEditPress,
          },
        ]}
        renderItem={item => (
          <Pressable style={styles.optionContainer} onPress={item.onPress}>
            <AntDesign name={item.icon} size={24} color={colors.PRIMARY} />
            <Text style={styles.optionLabel}>{item.title}</Text>
          </Pressable>
        )}
      />
    </>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },
  optionLabel: {
    color: colors.PRIMARY,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default UploadTab;
