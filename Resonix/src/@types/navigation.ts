import { NavigatorScreenParams } from '@react-navigation/native';
import { AudioData } from './audio';

export type TabParamList = {
  HomeNavigator: NavigatorScreenParams<HomeNavigatorStackParamList>;
  ProfileScreen: undefined;
  UploadScreen: undefined;
};


interface NewUserResponse {
  user: string;
  name: string;
  email: string;
}

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  LostPassword: undefined;
  Verification: { userInfo: NewUserResponse; redirectTo: 'SignIn' };
};

export type ProfileNavigatorStackParamList = {
  Profile: undefined;
  ProfileSettings: undefined;
  Verification: { userInfo: NewUserResponse; redirectTo: 'ProfileSettings' };
  UpdateAudio: {audio: AudioData};
};

export type HomeNavigatorStackParamList = {
  Home: undefined;
  PublicProfile: { profileId: string };
};
