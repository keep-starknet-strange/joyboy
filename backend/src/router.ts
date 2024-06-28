import express from 'express';

import deposit from './routes/deposit';
import health from './routes/health';

const Router = express.Router();

Router.use('/health', health);

Router.use('/deposit', deposit);

export default Router;
