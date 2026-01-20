import { FC, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as yup from 'yup';

import colors from '@utils/colors';
import AuthInputField from '@components/form/AuthInputField';
import Form from '@components/form';
import SubmitBtn from '@components/form/SubmitBtn';
import PasswordVisibilityIcon from '@ui/PasswordVisibilityIcon';
import AppLink from '@ui/AppLink';
import AuthFormContainer from 'components/form/AuthFormContainer';

const signUpSchema = yup.object({
  name: yup
    .string()
    .trim('Name is missing!')
    .required('Name is required!')
    .min(3, 'Name must be at least 3 characters'),
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
    .required('Password is required!')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password is too weak!',
    ),
});

interface Props {}

const initialValues = {
  name: '',
  email: '',
  password: '',
};

const SignUp: FC<Props> = () => {
  const [secureEntry, setSecureEntry] = useState(true);

  const togglePasswordVisibility = () => {
    setSecureEntry(!secureEntry);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20} // adjust for header
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}
          keyboardShouldPersistTaps="handled"
        >
          <Form
            initialValues={initialValues}
            onSubmit={values => {
              console.log(values);
            }}
            validationSchema={signUpSchema}
          >
            <AuthFormContainer
              heading="Welcome !"
              subHeading="Let's get started by creating your account"
            >
              <View style={styles.formContainer}>
                <AuthInputField
                  placeholder="Full name"
                  label="Full Name"
                  keyboardType="default"
                  returnKeyType="next"
                  autoCapitalize="words"
                  secureTextEntry={false}
                  containerStyle={styles.marginBottom}
                  name="name"
                />

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
                <SubmitBtn title="Sign Up" />

                <View style={styles.linksContainer}>
                  <AppLink
                    title="By signing up, you agree to our Terms & Privacy Policy"
                    onPress={() => {}}
                  />
                  <AppLink
                    title="Already have an account? Sign In"
                    onPress={() => {}}
                  />
                </View>
              </View>
            </AuthFormContainer>
          </Form>
        </ScrollView>
      </KeyboardAvoidingView>
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

export default SignUp;
