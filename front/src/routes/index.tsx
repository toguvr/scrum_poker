import React from 'react';
import { Switch } from 'react-router-dom';

import Home from '../pages/Home';
import Room from '../pages/Room';
import SignIn from '../pages/SignIn';
import Route from './Route';

export const routes = {
  home: '/home',
  room: '/room',
  signin: '/',
};

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path={routes.room} isPrivate component={Room} />
      <Route path={routes.home} isPrivate component={Home} />
      <Route path={routes.signin} component={SignIn} />
    </Switch>
  );
};

export default Routes;
