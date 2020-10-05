import styled, { css } from 'styled-components';
import Tooltip from '../Tooltip';

interface ContainerProps {
  isFocused: boolean;
  isFilled: boolean;
  maxWidth?: string;
  margin?: boolean;
  erroMsg: boolean;
}

export const Container = styled.div<ContainerProps>`
  background: inherit;
  border-radius: 10px;
  border: 2px solid #666360;
  padding: 16px;
  width: ${(props) => (props.maxWidth ? props.maxWidth : '100%')};
  color: #666360;

  display: flex;
  align-items: center;

  input {
    width: 100%;
    border: 0;
    background: transparent;
    color: #f4ede8;

    ::-webkit-calendar-picker-indicator {
      filter: invert(100%);
    }

    :-webkit-autofill {
      -webkit-box-shadow: 0 0 0 30px #151e34 inset;
    }

    /* Cor do texto do autocomplete */
    :-webkit-autofill {
      -webkit-text-fill-color: white !important;
    }
    ::placeholder {
      color: #666360;
    }
  }

  ${(props) =>
    props.margin &&
    css`
      & + div {
        margin-top: 8px;
      }
    `}

  ${(props) =>
    props.erroMsg &&
    css`
      border-color: #c53030;
    `}

  ${(props) =>
    props.isFocused &&
    css`
      color: #fff;
      border-color: #fff;
    `}

  ${(props) =>
    props.isFilled &&
    css`
      color: #fff;
    `}


  svg {
    margin-right: 16px;
  }
`;

export const Error = styled(Tooltip)`
  height: 20px;
  margin-left: 16px;

  svg {
    margin: 0%;
  }

  span {
    background: #c53030;
    color: #fff;

    &::before {
      border-color: #c53030 transparent;
    }
  }
`;
