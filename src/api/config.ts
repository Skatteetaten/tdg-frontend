import { env } from 'node:process';

const TDG_BACKEND_URL = env.TDG_BACKEND_URL || 'http://localhost:8081';

const TDG_KOTLIN_COMPILER_SERVER_URL =
  env.TDG_KOTLIN_COMPILER_SERVER_URL || 'http://localhost:8080';

export { TDG_BACKEND_URL, TDG_KOTLIN_COMPILER_SERVER_URL };
