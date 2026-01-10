import * as yup from "yup";
import { RequestHandler } from "express";
import { CreateUserSchema } from "@/utils/validationSchema";

export const validate = (schema: yup.ObjectSchema<any>): RequestHandler => {
  return async (req, res, next) => {
    if (!req.body) return res.status(422).json({ error: "No body found" });

    try {
      await schema.validate(req.body, { abortEarly: true });
      next();
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        return res.status(422).json({ error: err.message });
      }

      return res.status(422).json({ error: "Something went wrong" });
    }
  };
};
