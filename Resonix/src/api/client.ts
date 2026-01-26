import axios, { CreateAxiosDefaults } from 'axios';
import { getFromAsyncStorage, Keys } from 'utils/asyncStorage';

const BASE_URL = 'http://10.0.2.2:8989';

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
  },
});

type Headers = CreateAxiosDefaults<any>['headers'];

export const getClient = async (headers?: Headers) => {
  const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
  if(!token) return axios.create({
    baseURL: BASE_URL,
  });

  const defaultHeaders = {
    Authorization: 'Bearer ' + token,
    ...headers,
  };

  return axios.create({
    baseURL: BASE_URL,
    headers: defaultHeaders,
  });
};

export default client;
