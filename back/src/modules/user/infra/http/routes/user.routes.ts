import { Router } from 'express';

import { celebrate, Segments, Joi } from 'celebrate';
import UserCotroller from '../controllers/UserCotroller';

const userRouter = Router();
const userCotroller = new UserCotroller();

userRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
    },
  }),
  userCotroller.create,
);

export default userRouter;
