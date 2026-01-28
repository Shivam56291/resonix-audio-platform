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
};
