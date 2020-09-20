import { Router } from 'express';

import { celebrate, Segments, Joi } from 'celebrate';
import RoomController from '../controllers/RoomController';
import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';

const roomRouter = Router();
const createRoomController = new RoomController();
roomRouter.use(ensureAuthenticated);

roomRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      isPrivate: Joi.boolean(),
      password: Joi.string().valid(Joi.ref('isPrivate')),
    },
  }),
  createRoomController.create,
);

export default roomRouter;
