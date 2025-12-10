// This will add environment variabled from .env file. This is neccessary when using
// BearerAuthRouter. This is only needed during development, as these variables will be
// available during runtime by configuration.
import 'dotenv/config';

import './api/server.js';
