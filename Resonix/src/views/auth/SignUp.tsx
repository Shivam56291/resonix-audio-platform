import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as yup from 'yup';

import colors from '@utils/colors';
import AuthInputField from '@components/form/AuthInputField';
import Form from '@components/form';
import SubmitBtn from '@components/form/SubmitBtn';

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
  return (
    <SafeAreaView style={styles.container}>
      <Form
        initialValues={initialValues}
        onSubmit={values => {
          console.log(values);
        }}
        validationSchema={signUpSchema}
      >
        <View style={styles.formContainer}>
          <AuthInputField
            placeholder="John Doe"
            label="Full Name"
            keyboardType="default"
            returnKeyType="next"
            autoCapitalize="words"
            secureTextEntry={false}
            containerStyle={styles.marginBottom}
            name="name"
          />

          <AuthInputField
            placeholder="johndoe@example.com"
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
            secureTextEntry={true}
            name="password"
            containerStyle={styles.marginBottom}
          />
          <SubmitBtn title="Sign Up" />
        </View>
      </Form>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 15,
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
});

export default SignUp;
