import axios from 'axios';

const client = axios.create({
  baseURL: 'http://10.0.2.2:8989',
});

export default client;
