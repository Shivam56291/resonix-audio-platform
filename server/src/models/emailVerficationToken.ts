import { Schema, model, Types, Document } from "mongoose";
import { hash, compare } from "bcrypt";

interface EmailVerificationTokenDocument extends Document {
  owner: Types.ObjectId;
  token: string;
  createdAt: Date;
  compareToken(token: string): Promise<boolean>;
}

const emailVerificationTokenSchema = new Schema<EmailVerificationTokenDocument>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 60,
    },
  }
);

emailVerificationTokenSchema.pre("save", async function () {
  if (this.isModified("token")) {
    this.token = await hash(this.token, 10);
  }
});

emailVerificationTokenSchema.methods.compareToken = async function (
  token: string
) {
  return await compare(token, this.token);
};

export default model<EmailVerificationTokenDocument>(
  "EmailVerificationToken",
  emailVerificationTokenSchema
);
