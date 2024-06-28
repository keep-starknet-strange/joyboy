import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from './router';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use('/', router);

app.listen(3001, () => {
  console.info(`Express server started listening on port ${3001}`);
});
