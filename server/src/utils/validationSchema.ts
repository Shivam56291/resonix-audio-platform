import * as yup from "yup";

export const CreateUserSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is missing!")
    .min(3, "Name must be at least 3 characters long")
    .max(30, "Name must be at most 30 characters long"),
  email: yup
    .string()
    .required("Email is missing!")
    .email("Invalid email")
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Email must be a valid email address"
    ),
  password: yup
    .string()
    .required("Password is missing!")
    .min(8, "Password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});
