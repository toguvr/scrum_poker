import React from 'react';

import './styles.css';

interface InputProps {
  checked: boolean;
  onClick(): void;
}

const Switch: React.FC<InputProps> = ({ checked, onClick }) => {
  return (
    <label className="switch">
      <input onClick={onClick} checked={checked} type="checkbox" />
      <span className="slider round"></span>
    </label>
  );
};

export default Switch;
