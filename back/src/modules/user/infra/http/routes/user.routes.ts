import { Router } from 'express';

import { celebrate, Segments, Joi } from 'celebrate';
import UserController from '../controllers/UserController';

const passwordRouter = Router();
const createUserController = new UserController();

passwordRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
    },
  }),
  createUserController.create,
);

export default passwordRouter;
