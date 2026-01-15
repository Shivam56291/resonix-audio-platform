import * as yup from "yup";
import { isValidObjectId } from "mongoose";
import { categories } from "./audio_category";

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

export const TokenAndIDValidation = yup.object().shape({
  token: yup.string().trim().required("Token is missing!"),
  userId: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      }
      return "";
    })
    .required("Invalid user ID"),
});

export const updatePasswordSchema = yup.object().shape({
  userId: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      }
      return "";
    })
    .required("Invalid user ID"),
  password: yup
    .string()
    .required("Password is missing!")
    .min(8, "Password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

export const SignInValidationSchema = yup.object().shape({
  email: yup.string().required("Email is missing!").email("Invalid email id!"),
  password: yup
    .string()
    .required("Password is missing!")
    .min(8, "Password must be at least 8 characters long"),
});

export const AudioValidationSchema = yup.object().shape({
  title: yup.string().required("Title is missing!"),
  about: yup.string().required("About is missing!"),
  category: yup.string().oneOf(categories).required("Category is missing!"),
});

export const NewPlaylistValidationSchema = yup.object().shape({
  title: yup.string().required("Title is missing!"),
  resId: yup
  .string()
  .transform(function (value) {
    if (this.isType(value) && isValidObjectId(value)) {
      return value;
    }
    return "";
  }),
  visibility: yup
    .string()
    .oneOf(["public", "private"], "Visibility is must be public or private!")
    .required("Visibility is missing!"),
});

export const OldPlaylistValidationSchema = yup.object().shape({
  title: yup.string().required("Title is missing!"),
  item: yup
  .string()
  .transform(function (value) {
    if (this.isType(value) && isValidObjectId(value)) {
      return value;
    }
    return "";
  }),
  id: yup
  .string()
  .transform(function (value) {
    if (this.isType(value) && isValidObjectId(value)) {
      return value;
    }
    return "";
  }),
  visibility: yup
    .string()
    .oneOf(["public", "private"], "Visibility is must be public or private!")
});
