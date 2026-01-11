const {env} = process as {env: {[key: string]: string}};

export const MONGODB_URI = env.MONGODB_URI;
export const PORT = env.PORT;
export const MAILTRAP_USER = env.MAILTRAP_USER;
export const MAILTRAP_PASS = env.MAILTRAP_PASS;