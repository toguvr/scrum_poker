import React, { useCallback, useEffect, useState } from 'react';
import InputDefault from '../../components/InputDefault';
import Logo from '../../assets/logo.svg';
import { Container, Rooms } from './styles';
import Button from '../../components/Button';
import { FaLockOpen, FaLock, FaUsers, FaEye } from 'react-icons/fa';
import Switch from '../../components/Switch';
import api from '../../services/api';
import { useLoad } from '../../hooks/load';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import { useSocket } from '../../hooks/socket';
import { useHistory } from 'react-router-dom';
import { routes } from '../../routes';

export interface User {
  id: string;
  name: string;
}

export interface RoomProps {
  id: string;
  topic: string;
  adm_id: string;
  admin: User;
  isPrivate: boolean | number;
  password: string | null;
  usersRoom: UsersRoom[];
}

export interface UsersRoom {
  id: string;
  user_id: string;
  user: User;
  room_id: string;
  room: RoomProps;
  vote: number | null;
}

const Home: React.FC = () => {
  const { start, stop } = useLoad();
  const { user, signOut } = useAuth();
  const { addToast } = useToast();
  const { socket } = useSocket();
  const { push } = useHistory();

  const [password, setPassword] = useState('');
  const [roomPassword, setRoomPassword] = useState('');
  const [checked, setChecked] = useState(false);
  const [showPass, setShowPass] = useState('');
  const [passError, setPassError] = useState('');
  const [allRooms, setAllRooms] = useState<RoomProps[]>([]);
  const currentRoom = JSON.parse(localStorage.getItem('currentRoom') || '{}');

  useEffect(() => {
    if (currentRoom) {
      if (currentRoom.id) {
        socket.emit('leaveRoom', currentRoom.id);
        localStorage.removeItem('currentRoom');
      }
    }

    socket.emit('joinHome');
  }, []);

  const getRooms = useCallback(async () => {
    start();
    try {
      const response = await api.get('/room');
      setAllRooms(response.data);
    } catch (err) {
    } finally {
      stop();
    }
  }, []);

  const createRoom = useCallback(async () => {
    if (checked && password.length <= 2) {
      return setPassError('Senha deve conter pelo menos 3 dígitos');
    }
    setPassError('');
    start();
    try {
      const body = {
        isPrivate: checked,
        password,
      };
      const response = await api.post('/room', body);
      getRooms();
      setPassword('');
      setChecked(false);

      socket.emit('newRoom', response.data.id);

      localStorage.setItem('currentRoom', JSON.stringify(response.data));
      push(routes.room);
    } catch (err) {
    } finally {
      stop();
    }
  }, [checked, password, getRooms, socket]);

  const leaveScrum = useCallback(async () => {
    start();
    try {
      await api.get('/room/leave');
      signOut();
    } catch (err) {
    } finally {
      stop();
    }
  }, []);

  const joinRoom = useCallback(
    async (room, isPrivate) => {
      if (isPrivate && roomPassword.length === 0) {
        addToast({
          type: 'error',
          title: 'Dígite a senha',
          description: 'Após digitar a senha clique na sala novamente.',
        });
        return setShowPass(room.id);
      }
      start();
      try {
        const body = {
          room_id: room.id,
          password: roomPassword,
        };
        await api.post(`/usersRoom/room`, body);
        setRoomPassword('');
        setShowPass('');
        localStorage.setItem('currentRoom', JSON.stringify(room));
        getRooms();
        socket.emit('newRoom', room.id);

        addToast({
          type: 'success',
          title: `Entrou na sala`,
        });
        push(routes.room);
      } catch (err) {
        if (err?.response?.data?.message == 'Você já está na sala.') {
          localStorage.setItem('currentRoom', JSON.stringify(room));
          return push(routes.room);
        }
        if (
          err?.response?.data?.message ==
          'Você é o admin, não pode entrar para votar.'
        ) {
          localStorage.setItem('currentRoom', JSON.stringify(room));
          return push(routes.room);
        }

        return addToast({
          type: 'error',
          title:
            err?.response?.data?.message || 'Ocorreu um erro, tente novamente.',
        });
      } finally {
        stop();
      }
    },
    [checked, password, getRooms, roomPassword, socket],
  );

  const seeRoom = useCallback(
    async (room, isPrivate) => {
      if (isPrivate && roomPassword.length === 0) {
        addToast({
          type: 'error',
          title: 'Dígite a senha',
          description: 'Após digitar a senha clique na sala novamente.',
        });
        return setShowPass(room.id);
      }
      start();
      try {
        const body = {
          room_id: room.id,
          password: roomPassword,
        };
        await api.post(`/usersRoom/seeRoom`, body);
        setRoomPassword('');
        setShowPass('');
        localStorage.setItem('currentRoom', JSON.stringify(room));
        socket.emit('newRoom', room.id);

        getRooms();
        addToast({
          type: 'success',
          title: `Entrou na sala`,
        });
        push(routes.room);
      } catch (err) {
        if (err?.response?.data?.message == 'Você já está na sala.') {
          localStorage.setItem('currentRoom', JSON.stringify(room));
          return push(routes.room);
        }
        if (
          err?.response?.data?.message ==
          'Você é o admin, não pode entrar para votar.'
        ) {
          localStorage.setItem('currentRoom', JSON.stringify(room));
          return push(routes.room);
        }

        return addToast({
          type: 'error',
          title:
            err?.response?.data?.message || 'Ocorreu um erro, tente novamente.',
        });
      } finally {
        stop();
      }
    },
    [checked, password, getRooms, roomPassword, socket],
  );

  useEffect(() => {
    getRooms();
  }, []);

  useEffect(() => {
    socket.on('createRoomatHome', (response: RoomProps | UsersRoom) => {
      getRooms();
    });

    socket.on('joinRoomAtHome', (response: RoomProps | UsersRoom) => {
      getRooms();
    });

    socket.on('leftHome', (response: RoomProps | UsersRoom) => {
      getRooms();
    });
  }, [socket, getRooms]);

  return (
    <Container>
      <div>
        <img src={Logo} alt="logo beegin" />
        <h2>Bem Vindo, {user.name}!</h2>
        <Rooms>
          <header>Salas</header>
          <main>
            {allRooms.map((room) => {
              return (
                <>
                  <div key={room.id}>
                    <div onClick={() => joinRoom(room, room.isPrivate)}>
                      <span>
                        {room.isPrivate ? <FaLock /> : <FaLockOpen />}
                        Sala {room.admin.name}
                      </span>
                      <span>
                        {<FaUsers />}
                        {room.usersRoom.length}
                      </span>
                    </div>
                    <main onClick={() => seeRoom(room, room.isPrivate)}>
                      <FaEye />
                    </main>
                  </div>
                  {showPass === room.id ? (
                    <div>
                      <InputDefault
                        placeholder="Senha da sala*"
                        name="roomPassword"
                        maxWidth="400"
                        value={roomPassword}
                        onChange={(e) => setRoomPassword(e.target.value)}
                      />
                    </div>
                  ) : (
                    ''
                  )}
                </>
              );
            })}
          </main>
        </Rooms>

        <hr />
        <div>
          <span>
            Sala Fechada:
            <Switch onClick={() => setChecked(!checked)} checked={checked} />
          </span>
          {checked && (
            <InputDefault
              placeholder="Senha*"
              name="password"
              error={passError}
              type="password"
              maxWidth="400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}
        </div>
        <div>
          <Button onClick={createRoom}>Criar Sala</Button>
        </div>
        <div>
          <Button onClick={leaveScrum} transparent>
            Sair
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default Home;
