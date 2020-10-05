import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import 'express-async-errors';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import routes from './routes';
import http from 'http';
import socketio from 'socket.io';

import '@shared/infra/typeorm';
import '@shared/container';
import { container } from 'tsyringe';
import CreateRoomService from '@modules/room/services/CreateRoomService';

const app = express();

const server = http.createServer(app);

const io = socketio(server);

interface ConnectUser {
  [key: string]: string;
}

const connectedUsers = {} as ConnectUser;

io.on('connection', socket => {
  const { user_id } = socket.handshake.query;
  // socket.join('home room');
  connectedUsers[user_id] = socket.id;

  socket.on('joinHome', () => {
    socket.join(`home room`);
  });

  socket.on('leaveHome', () => {
    socket.leave('home room');
  });

  socket.on('newRoom', room_id => {
    socket.join(`room${room_id}`);
  });

  socket.on('leaveRoom', room_id => {
    socket.leave(`room${room_id}`);
  });

  socket.on('disconnect', async () => {
    const createRoom = container.resolve(CreateRoomService);

    const { room_id, boolean } = await createRoom.leave(user_id);

    if ((boolean === 'admin' || boolean === true) && connectedUsers) {
      io.to(`room${room_id}`).emit('leftRoom', {
        boolean,
        sala: `room${room_id}`,
      });

      io.to('home room').emit('leftHome', { boolean, sala: `server` });
    }

    delete connectedUsers[user_id];
  });
});

app.use((request: Request, res: Response, next: NextFunction) => {
  request.io = io;
  request.connectedUsers = connectedUsers;

  return next();
});

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));

app.use(routes);

app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

server.listen(3333, () => {
  console.log('🦾 Server started on port 3333');
});
