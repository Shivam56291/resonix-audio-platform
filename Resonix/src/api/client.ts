import axios from 'axios';

const client = axios.create({
  baseURL: 'http://10.0.2.2:8989',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default client;
