import axios, { isAxiosError } from 'axios';

const apiBase = '/api/send';

const axiosInstance = axios.create({
  baseURL: apiBase,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAxiosError(error)) {
      const data = error.response?.data as {
        message?: string;
        code?: string;
        details?: unknown;
        traceId?: string;
      };

      return Promise.reject(
        Object.assign(new Error(data?.message || 'Klarte ikke sende melding'), {
          status: error.response?.status,
          code: data?.code,
          details: data?.details,
          traceId: data?.traceId,
        }),
      );
    }
    return Promise.reject(new Error('Uventet feil.'));
  },
);

export default axiosInstance;
