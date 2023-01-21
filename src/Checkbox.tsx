import * as React from 'react';
import styled from '@emotion/styled';
import { useState } from 'react';
import pointer from './images/pointer.png';
import { useThemeContext } from './ThemeProvider/ThemeProvider';

interface TProps {
  colors: any;
  text: string;
  checked: boolean;
  onChange: (option: boolean) => void;
}

const Checkbox: React.FC<TProps> = ({ colors, text, checked, onChange }) => {
  const [boxChecked, setBoxChecked] = useState(checked);
  const theme = useThemeContext();

  const toggleBoxChecked = () => {
    boxChecked ? setBoxChecked(false) : setBoxChecked(true);
    onChange(!boxChecked);
  };

  return (
    <CheckboxMain
      colors={colors}
      pointer={pointer}
      className={'d-flex flex-row justify-content-start align-items-center ' + theme.theme.themeBgDark2}
      onClick={() => toggleBoxChecked()}
    >
      <input
        className="checkbox"
        type="checkbox"
        checked={boxChecked}
        aria-label="Checkbox for following text"
        onChange={() => toggleBoxChecked()}
      />
      <p
        className={
          boxChecked
            ? theme.theme.themeTypoDark50 + ' bold checked'
            : theme.theme.themeTypoDark + ' bold'
        }
      >
        {text}
      </p>
    </CheckboxMain>
  );
};

export default Checkbox;

type TColorProp = {
  colors: any;
  darkModus?: any;
};

type TPointerProp = {
  pointer: any;
};

type TNavProp = TColorProp & TPointerProp;

const CheckboxMain = styled.div<TNavProp>`
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

  p.bold {
    font-size: 12px;
    font-weight: 700;
    line-height: 15px;
    //color: ${({ colors, darkModus }) => (darkModus ? colors.white : colors.black)} !important;
    margin: 0px 0px 0px 16px;

    &.checked {
      //color: ${({ colors, darkModus }) => (darkModus ? colors.white50 : colors.black50)} !important;
      text-decoration: line-through;
    }
  }
`;
