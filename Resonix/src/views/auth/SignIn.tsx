import { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as yup from 'yup';

import colors from '@utils/colors';
import AuthInputField from '@components/form/AuthInputField';
import Form from '@components/form';
import SubmitBtn from '@components/form/SubmitBtn';
import PasswordVisibilityIcon from '@ui/PasswordVisibilityIcon';
import AppLink from '@ui/AppLink';
import AuthFormContainer from '@components/form/AuthFormContainer';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '../../@types/navigation';

const signInSchema = yup.object({
  email: yup
    .string()
    .trim('Email is missing!')
    .required('Email is required!')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Enter a valid email address',
    ),
  password: yup
    .string()
    .trim('Password is missing!')
    .required('Password is required!'),
});

interface Props {}

const initialValues = {
  email: '',
  password: '',
};

const SignIn: FC<Props> = () => {
  const [secureEntry, setSecureEntry] = useState(true);

  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  const togglePasswordVisibility = () => {
    setSecureEntry(!secureEntry);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Form
        initialValues={initialValues}
        onSubmit={values => {
          console.log(values);
        }}
        validationSchema={signInSchema}
      >
        <AuthFormContainer
          heading="Welcome Back !"
          subHeading="Sign in to continue and access your account"
        >
          <View style={styles.formContainer}>
            <AuthInputField
              placeholder="Email address"
              label="Email"
              keyboardType="email-address"
              returnKeyType="next"
              autoCapitalize="none"
              secureTextEntry={false}
              containerStyle={styles.marginBottom}
              name="email"
            />

            <AuthInputField
              placeholder="********"
              label="Password"
              keyboardType="default"
              returnKeyType="done"
              autoCapitalize="none"
              secureTextEntry={secureEntry}
              name="password"
              containerStyle={styles.marginBottom}
              rightIcon={
                <PasswordVisibilityIcon
                  privateIcon={secureEntry}
                  onPress={togglePasswordVisibility}
                />
              }
              onRightIconPress={togglePasswordVisibility}
            />
            <SubmitBtn title="Sign In" />

            <View style={styles.linksContainer}>
              <AppLink
                title="I Lost My Password"
                onPress={() => {
                  navigation.navigate('LostPassword');
                }}
              />
              <AppLink
                title="Sign Up"
                onPress={() => {
                  navigation.navigate('SignUp');
                }}
              />
            </View>
          </View>
        </AuthFormContainer>
      </Form>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.PRIMARY,
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 25,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.SECONDARY,
    height: 45,
    borderRadius: 23,
    color: colors.CONTRAST,
    padding: 10,
  },
  marginBottom: {
    marginBottom: 20,
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  // headerContainer: {
  //   alignItems: 'center',
  //   marginBottom: 20,
  // },
});

export default SignIn;
