import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Button from '../../components/Button';
import InputDefault from '../../components/InputDefault';
import Logo from '../../assets/logo.svg';
import LogoMini from '../../assets/logo3.svg';

import {
  Container,
  CardSection,
  CardSpace,
  Card,
  VoteSection,
  ButtonVote,
} from './styles';
import api from '../../services/api';
import { useLoad } from '../../hooks/load';
import { RoomProps, UsersRoom } from '../Home';
import { FaAngleLeft } from 'react-icons/fa';
import { useToast } from '../../hooks/toast';
import { useSocket } from '../../hooks/socket';
import { useAuth } from '../../hooks/auth';
import { useHistory } from 'react-router-dom';
import { routes } from '../../routes';

const Room: React.FC = () => {
  const { addToast } = useToast();
  const { push } = useHistory();
  const { socket } = useSocket();
  const { user } = useAuth();
  const { start, stop } = useLoad();

  const [topic, setTopic] = useState('');
  const [voted, setVoted] = useState(0);
  const [allInRoom, setAllInRoom] = useState<UsersRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<RoomProps>({} as RoomProps);

  useEffect(() => {
    socket.emit('leaveHome');
  }, []);

  const roomAdm = useMemo(() => {
    return currentRoom.adm_id === user.id;
  }, [currentRoom.id, user.id]);

  const allVoted = useMemo(() => {
    return allInRoom.filter((user) => user.vote === null);
  }, [allInRoom]);

  const userIsParticipant = useMemo(() => {
    return allInRoom.find((current) => current.user_id === user.id);
  }, [allInRoom]);

  const getRoomUsers = useCallback(async () => {
    start();
    try {
      const response = await api.get(`/usersRoom/${currentRoom?.id}`);
      setAllInRoom(response.data);
    } catch (err) {
    } finally {
      stop();
    }
  }, [currentRoom.id]);

  const newRound = useCallback(async () => {
    start();
    try {
      const body = {
        topic,
      };
      const response = await api.put('/room', body);
      getRoomUsers();
      setTopic('');
      setCurrentRoom(response.data);
    } catch (err) {
      return addToast({
        type: 'error',
        title: err.response.data.message || 'Ocorreu um erro, tente novamente.',
      });
    } finally {
      stop();
    }
  }, [topic, getRoomUsers]);

  const newVote = useCallback(
    async (vote: number) => {
      if (!currentRoom.topic) {
        return addToast({
          type: 'error',
          title: 'Espere o admin escrever um tópico.',
        });
      }
      start();
      try {
        const body = {
          room_id: currentRoom.id,
          vote,
        };
        await api.put('/usersRoom/vote', body);
        getRoomUsers();

        setVoted(vote);
      } catch (err) {
        return addToast({
          type: 'error',
          title:
            err.response.data.message || 'Ocorreu um erro, tente novamente.',
        });
      } finally {
        stop();
      }
    },
    [getRoomUsers, currentRoom],
  );

  useEffect(() => {
    setCurrentRoom(JSON.parse(localStorage.getItem('currentRoom') || '{}'));
  }, []);

  useEffect(() => {
    if (currentRoom.id) {
      getRoomUsers();
    }
  }, [currentRoom]);

  const leaveScrum = useCallback(async () => {
    start();
    try {
      const response = await api.get('/room/leave');
      push(routes.home);
    } catch (err) {
    } finally {
      stop();
    }
  }, [socket, addToast]);

  useEffect(() => {
    if (currentRoom.id) {
      socket.on(`joinRoom`, (response: RoomProps | UsersRoom) => {
        getRoomUsers();
      });

      socket.on(`newTopic${currentRoom.id}`, (room: RoomProps) => {
        setCurrentRoom(room);
        getRoomUsers();
        setVoted(0);
      });

      socket.on(`newVote${currentRoom.id}`, (room: RoomProps) => {
        getRoomUsers();
      });

      socket.on(
        `leftRoom`,
        (response: { boolean: boolean | string; sala: string }) => {
          if (response?.boolean === 'admin') {
            leaveScrum();

            addToast({
              type: 'error',
              title: 'Admin fechou a sala',
            });
          }

          getRoomUsers();
        },
      );
    }
  }, [socket, currentRoom, getRoomUsers]);

  return (
    <Container>
      <div>
        <header>
          <FaAngleLeft cursor="pointer" size="30" onClick={leaveScrum} />
          <img src={Logo} alt="logo beegin" />
        </header>
        <h1>Tópico: {currentRoom.topic}</h1>
        <CardSection>
          {allInRoom.map((userRoom) => {
            return (
              <CardSpace key={userRoom.id}>
                <span>{userRoom.user.name}</span>
                <Card borderReady={!!userRoom.vote}>
                  {allVoted.length === 0 ? (
                    <h1>{userRoom.vote}</h1>
                  ) : (
                    <img src={LogoMini} alt="" />
                  )}
                </Card>
              </CardSpace>
            );
          })}
        </CardSection>
        {userIsParticipant && (
          <VoteSection>
            <ButtonVote onClick={() => newVote(1)} selected={voted === 1}>
              1
            </ButtonVote>
            <ButtonVote onClick={() => newVote(3)} selected={voted === 3}>
              3
            </ButtonVote>
            <ButtonVote onClick={() => newVote(5)} selected={voted === 5}>
              5
            </ButtonVote>
            <ButtonVote onClick={() => newVote(8)} selected={voted === 8}>
              8
            </ButtonVote>
            <ButtonVote onClick={() => newVote(13)} selected={voted === 13}>
              13
            </ButtonVote>
            <ButtonVote onClick={() => newVote(20)} selected={voted === 20}>
              20
            </ButtonVote>
          </VoteSection>
        )}
        {roomAdm && (
          <div>
            <InputDefault
              placeholder="Novo Tópico"
              name="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <Button style={{ marginTop: 16 }} onClick={newRound}>
              Criar
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
};

export default Room;
