import axios from 'axios';

import {BACKEND_URL} from '../constants/env';

export const ApiInstance = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});
