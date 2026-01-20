import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as yup from 'yup';

import colors from '@utils/colors';
import AuthInputField from '@components/form/AuthInputField';
import Form from '@components/form';
import SubmitBtn from '@components/form/SubmitBtn';
import AppLink from '@ui/AppLink';
import AuthFormContainer from '@components/form/AuthFormContainer';

const lostPasswordSchema = yup.object({
  email: yup
    .string()
    .trim('Email is missing!')
    .required('Email is required!')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Enter a valid email address',
    ),
});

interface Props {}

const initialValues = {
  email: '',
};

const LostPassword: FC<Props> = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Form
        initialValues={initialValues}
        onSubmit={values => {
          console.log(values);
        }}
        validationSchema={lostPasswordSchema}
      >
        <AuthFormContainer
          heading="Forgot Password?"
          subHeading="Enter your email address and we'll send you a reset link"
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
            <SubmitBtn title="Send Link" />

            <View style={styles.linksContainer}>
              <AppLink
                title="Remembered your password? Sign In"
                onPress={() => {}}
              />
              <AppLink
                title="Don't have an account? Sign Up"
                onPress={() => {}}
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
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
    gap: 12,
  },
});

export default LostPassword;
