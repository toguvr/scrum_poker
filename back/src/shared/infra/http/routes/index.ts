import { Router } from 'express';

import userRouter from '@modules/user/infra/http/routes/user.routes';
import roomRouter from '@modules/room/infra/http/routes/room.routes';
import usersRoomRouter from '@modules/usersRoom/infra/http/routes/usersRoom.routes';

const routes = Router();

routes.use('/user', userRouter);
routes.use('/room', roomRouter);
routes.use('/usersRoom', usersRoomRouter);

export default routes;
