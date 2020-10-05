import { Router } from 'express';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';

import { celebrate, Segments, Joi } from 'celebrate';

import UsersRoomController from '../controllers/UsersRoomController';

const roomUsersRouter = Router();

const usersRoomController = new UsersRoomController();

roomUsersRouter.use(ensureAuthenticated);

roomUsersRouter.get(
  '/:room_id',
  celebrate({
    [Segments.PARAMS]: {
      room_id: Joi.string().uuid().required(),
    },
  }),
  usersRoomController.index,
);

roomUsersRouter.post(
  '/room',
  celebrate({
    [Segments.BODY]: {
      room_id: Joi.string().uuid().required(),
      password: Joi.optional(),
    },
  }),
  usersRoomController.create,
);

roomUsersRouter.post(
  '/seeRoom',
  celebrate({
    [Segments.BODY]: {
      room_id: Joi.string().uuid().required(),
      password: Joi.optional(),
    },
  }),
  usersRoomController.see,
);

roomUsersRouter.put(
  '/vote',
  celebrate({
    [Segments.BODY]: {
      room_id: Joi.string().uuid().required(),
      vote: Joi.number().required(),
    },
  }),
  usersRoomController.update,
);

export default roomUsersRouter;
