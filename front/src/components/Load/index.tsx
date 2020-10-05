import React from 'react';

import Loader from 'react-loader-spinner';
import { Container } from './styles';

const Load: React.FC = () => {
  return (
    <Container>
      <Loader type="Circles" color="#fff" height={100} width={100} />
    </Container>
  );
};

export default Load;
