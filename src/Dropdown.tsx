import * as React from 'react';
import styled from '@emotion/styled';
import { useState } from 'react';
import pointer from './images/pointer.png';

interface TProps {
  className?: string;
  colors: any;
  title?: string;
  text: string | undefined;
  entries: any;
  changeDropdown: (option: string) => void;
}

const Dropdown: React.FC<TProps> = ({ className, colors, title, text, entries, changeDropdown }) => {
  const [boxChecked, setBoxChecked] = useState(false);

  const selectDropdown = (option: string) => {
    console.log(option);
    changeDropdown(option);
  };

  return (
    <DropdownMain
      colors={colors}
      pointer={pointer}
      className={className + ' d-flex flex-column justify-content-start align-items-start'}
    >
      <label htmlFor="dropdown">{title}</label>

      <select
        id="dropdown"
        name="Dropdown"
        value={text}
        onChange={(e) => selectDropdown(e.target.value)}
      >
        {entries.map((entry: any, i: any) => {
          return (
            <option value={entry.name} key={i}>
              {entry.name}
            </option>
          );
        })}
      </select>
    </DropdownMain>
  );
};

export default Dropdown;

type TColorProp = {
  colors: any;
};

type TPointerProp = {
  pointer: any;
};

type TNavProp = TColorProp & TPointerProp;

const DropdownMain = styled.div<TNavProp>`
  label {
    font-size: 12px;
    font-weight: 700;
    line-height: 15px;
    color: ${({ colors }) => colors.medium_grey};
    margin-bottom: 8px;
  }

  select {
    width: 100%;
    padding: 8px 16px;
    border-radius: 4px;

    font-size: 13px;
    font-weight: 500;
    line-height: 23px;

    cursor: url('${({ pointer }) => pointer}'), pointer;

    &:active,
    &:hover,
    &:focus-visible {
      border: 1px solid ${({ colors }) => colors.main_purple};
      outline: none;
    }
  }
`;

/* 
selected={entry.name === text} 
*/
