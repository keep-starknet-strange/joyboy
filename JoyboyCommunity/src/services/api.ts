import axios from 'axios';

export const ApiInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});
