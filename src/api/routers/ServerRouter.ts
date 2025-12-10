import express, { Router } from 'express';
import axios, { isAxiosError } from 'axios';
import { TDG_KOTLIN_COMPILER_SERVER_URL } from '../config.js';

const serverRouter = Router();

function handleAxiosError(error: unknown, res: express.Response) {
  if (isAxiosError(error)) {
    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else {
      res
        .status(500)
        .send({ message: 'Kotlin Compiler Server er utilgjengelig' });
    }
  } else {
    res.status(500).send({ message: 'Serverfeil' });
  }
}

serverRouter.get('/versions', async (req, res) => {
  try {
    const respons = await axios.get(
      TDG_KOTLIN_COMPILER_SERVER_URL + '/api/versions',
    );
    res.send(respons.data);
  } catch (error) {
    handleAxiosError(error, res);
  }
});

serverRouter.post('/api/:version/compiler/highlight/', async (req, res) => {
  try {
    const respons = await axios.post(
      TDG_KOTLIN_COMPILER_SERVER_URL + '/api/2.2.10/compiler/highlight',
      req.body,
    );
    res.send(respons.data);
  } catch (error) {
    handleAxiosError(error, res);
  }
});

serverRouter.post('/api/:version/compiler/complete', async (req, res) => {
  try {
    const respons = await axios.post(
      TDG_KOTLIN_COMPILER_SERVER_URL + req.originalUrl,
      req.body,
    );
    res.send(respons.data);
  } catch (error) {
    handleAxiosError(error, res);
  }
});

axios.interceptors.request.use((request) => {
  console.log('Starting Request', request);
  return request;
});

axios.interceptors.response.use((response) => {
  console.log('Response:', response);
  return response;
});

export { serverRouter };
