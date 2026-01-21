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
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FormikHelpers } from 'formik';

import colors from '@utils/colors';
import AuthInputField from '@components/form/AuthInputField';
import Form from '@components/form';
import SubmitBtn from '@components/form/SubmitBtn';
import PasswordVisibilityIcon from '@ui/PasswordVisibilityIcon';
import AppLink from '@ui/AppLink';
import AuthFormContainer from '@components/form/AuthFormContainer';
import { AuthStackParamList } from 'src/@types/navigation';
import TermsCheckbox from '@views/auth/TermsCheckbox';
import client from 'src/api/client';

const signUpSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required('Name is missing!')
    .min(3, 'Name must be at least 3 characters'),
  email: yup
    .string()
    .trim()
    .required('Email is missing!')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Enter a valid email address',
    ),
  password: yup
    .string()
    .trim()
    .required('Password is missing!')
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

interface NewUser {
  name: string;
  email: string;
  password: string;
}

const SignUp: FC<Props> = () => {
  const [secureEntry, setSecureEntry] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  const togglePasswordVisibility = () => {
    setSecureEntry(!secureEntry);
  };

  const handleFormSubmit = async (
    values: NewUser,
    actions: FormikHelpers<NewUser>,
  ) => {
    try {
      actions.setSubmitting(true);
      const response = await client.post('/auth/create', {
        ...values,
      });
      navigation.navigate('Verification', {
        userInfo: response.data,
      });
    } catch (error) {
      console.log(error);
    } finally {
      actions.setSubmitting(false);
    }
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
            onSubmit={handleFormSubmit}
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
                <SubmitBtn title="Sign Up" disabled={!termsAccepted} />

                <View style={styles.linksContainer}>
                  <TermsCheckbox
                    onToggle={checked => setTermsAccepted(checked)}
                  />
                  <AppLink
                    title="Already have an account? Sign In"
                    onPress={() => {
                      navigation.navigate('SignIn');
                    }}
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
    paddingHorizontal: 10,
  },
  marginBottom: {
    marginBottom: 15,
  },
  linksContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 10,
    paddingHorizontal: 10,
  },
  // headerContainer: {
  //   alignItems: 'center',
  //   marginBottom: 20,
  // },
});

export default SignUp;
