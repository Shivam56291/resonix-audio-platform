const {env} = process as {env: {[key: string]: string}};

export const MONGODB_URI = env.MONGODB_URI;