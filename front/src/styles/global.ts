import { createGlobalStyle } from 'styled-components';

export const palette = {
  primary: '#151E34',
  secondary: '#fff',
};

export default createGlobalStyle`
  *{
    margin: 0;
    padding: 0;
    outline:0;
    box-sizing: border-box;
  }

  body{
    background: #151E34;
    color: #fff;
    -webkit-font-smoothing: antialiased;
  }

  body, input, button {
    font: 16px 'Roboto', serif;
  }

  h1,h2,h3,h4,h5,h6,strong {
    font-weight: 500;
  }

  button{
    cursor: pointer;
  }
`;
