import axios from 'axios';
import NProgress from 'nprogress';
import { toast } from 'react-toastify';
import { api } from '../common/constants';
import 'nprogress/nprogress.css';

const instance = axios.create({
  baseURL: api.baseURL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer 123', // до цього ми ще повернемося якось потім
  },
});

NProgress.configure({ showSpinner: false });

instance.interceptors.request.use((config) => {
  NProgress.start();
  return config;
});

instance.interceptors.response.use(
  (res) => {
    NProgress.done();
    return res.data;
  },
  (error) => {
    NProgress.done();

    if (error.response) {
      toast.error(`Помилка ${error.response.status}: ${error.response.statusText}`);
    } else if (error.request) {
      toast.error('Сервер не відповідає');
    } else {
      toast.error('Помилка запиту');
    }

    return Promise.reject(error);
  }
);

export default instance;
