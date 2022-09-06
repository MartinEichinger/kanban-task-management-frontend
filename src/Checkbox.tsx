import * as React from 'react';
import styled from '@emotion/styled';
import { useState } from 'react';
import pointer from './images/pointer.png';

interface TProps {
  colors: any;
  text: string;
  checked: boolean;
  onChange: (option: boolean) => void;
}

const Checkbox: React.FC<TProps> = ({ colors, text, checked, onChange }) => {
  const [boxChecked, setBoxChecked] = useState(checked);

  const toggleBoxChecked = () => {
    boxChecked ? setBoxChecked(false) : setBoxChecked(true);
    onChange(!boxChecked);
  };

  return (
    <CheckboxMain
      colors={colors}
      pointer={pointer}
      className="d-flex flex-row justify-content-start align-items-center"
      onClick={() => toggleBoxChecked()}
    >
      <input
        className="checkbox"
        type="checkbox"
        checked={boxChecked}
        aria-label="Checkbox for following text"
        onChange={() => toggleBoxChecked()}
      />
      <p className={boxChecked ? 'bold checked' : 'bold'}>{text}</p>
    </CheckboxMain>
  );
};

export default Checkbox;

type TColorProp = {
  colors: any;
};

type TPointerProp = {
  pointer: any;
};

type TNavProp = TColorProp & TPointerProp;

const CheckboxMain = styled.div<TNavProp>`
  background-color: ${({ colors }) => colors.light_grey};
  border-radius: 4px;
  padding: 13px 16px;

  &:hover {
    background-color: ${({ colors }) => colors.main_purple25};
    cursor: url('${({ pointer }) => pointer}'), pointer;
  }

  input[type='checkbox'] {
    height: 16px;
    width: 16px;

    accent-color: ${({ colors }) => colors.main_purple};
  }

  p {
    font-size: 12px;
    font-weight: 700;
    line-height: 15px;
    color: ${({ colors }) => colors.black};
    margin: 0px 0px 0px 16px;

    &.checked {
      color: ${({ colors }) => colors.black50};
      text-decoration: line-through;
    }
  }
`;
