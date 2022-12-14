import * as React from 'react';
import styled from '@emotion/styled';
import { useState } from 'react';
import pointer from './images/pointer.png';
import { useAppSelector } from './store/hooks';
import { stat } from 'fs';

interface TProps {
  className?: string;
  colors: any;
  title?: string;
  text: string | undefined;
  entries: any;
  changeDropdown: (option: any) => void;
}

const debug = 0;

const Dropdown: React.FC<TProps> = ({ className, colors, title, text, entries, changeDropdown }) => {
  const [boxChecked, setBoxChecked] = useState(false);
  const darkModus = useAppSelector((state) => state.darkModus.darkModus);

  let defVal;

  const selectDropdown = (option: any) => {
    changeDropdown(option);
  };

  entries.map((entry: any, i: any) => {
    if (entry.name === text) defVal = i;
  });
  if (debug > 0) console.log('Dropdown/beforeRender: ', entries, text, defVal);

  return (
    <DropdownMain
      colors={colors}
      darkModus={darkModus}
      pointer={pointer}
      className={className + ' d-flex flex-column justify-content-start align-items-start'}
    >
      <label htmlFor="dropdown">{title}</label>

      <select
        id="dropdown"
        name="Dropdown"
        value={defVal}
        onChange={(e) => selectDropdown(e.target.value)}
      >
        {entries.map((entry: any, i: any) => {
          return (
            <option value={i} key={i}>
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
  darkModus?: any;
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
    color: ${({ colors, darkModus }) => (darkModus ? colors.white : colors.medium_grey)};
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
    background-color: ${({ colors, darkModus }) => (darkModus ? colors.dark_grey : colors.white)};
    color: ${({ colors, darkModus }) => (darkModus ? colors.white : colors.black)};

    &:active,
    &:hover,
    &:focus-visible {
      border: 1px solid ${({ colors }) => colors.main_purple};
      outline: none;
    }
  }
`;
