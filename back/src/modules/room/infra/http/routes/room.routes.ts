import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';

import RoomController from '../controllers/RoomController';

const roomRouter = Router();
const roomController = new RoomController();

roomRouter.use(ensureAuthenticated);

roomRouter.get('/', roomController.index);

roomRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      topic: Joi.string().required(),
    },
  }),
  roomController.update,
);

roomRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      isPrivate: Joi.boolean(),
      password: Joi.optional(),
    },
  }),
  roomController.create,
);

roomRouter.get('/leave', roomController.leave);

roomRouter.get('/teste', roomController.teste);

export default roomRouter;
