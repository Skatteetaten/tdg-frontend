import express, { json } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { TDG_BACKEND_URL } from './config.js';
import { serverRouter } from './routers/ServerRouter.js';

export const app = express();
app.disable('x-powered-by');

app.use(
  '/api/send',
  createProxyMiddleware({
    target: TDG_BACKEND_URL + '/api/dokumenter',
    changeOrigin: true,
  }),
);

app.use(json());

app.use('/api', serverRouter);

const nodeJsPort = process.env.NODEJS_PORT ?? 9090;
app.listen(nodeJsPort, () => {
  console.log(`Listening on port ${nodeJsPort}`);
});
