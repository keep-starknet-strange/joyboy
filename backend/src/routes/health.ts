import express from 'express';

const Router = express.Router();

Router.get('/', async (req, res) => {
  res.status(200).send();
});

export default Router;
