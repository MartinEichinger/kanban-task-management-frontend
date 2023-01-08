import * as React from 'react';
import styled from '@emotion/styled';
import { useAppSelector } from './store/hooks';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

interface TProps {
  className?: string;
  colors: any;
  title?: string;
  placeholder?: string;
  value: string;
  onChange?: any;
}

const Textfield: React.FC<TProps> = ({ className, colors, title, placeholder, onChange, value }) => {
  const darkModus = useAppSelector((state) => state.darkModus.darkModus);

  return (
    <TextfieldMain colors={colors} darkModus={darkModus} className={className}>
      <label htmlFor="textfield">{title}</label>

      <input
        type="text"
        id="textfield"
        name="textfield"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      ></input>
    </TextfieldMain>
  );
};

export default Textfield;

type TNavProp = {
  colors: any;
  darkModus?: any;
};

const TextfieldMain = styled.div<TNavProp>`
  width: 100%;

  label {
    font-size: 12px;
    font-weight: 700;
    line-height: 15px;
    color: ${({ colors, darkModus }) => (darkModus ? colors.white : colors.medium_grey)};
    margin-bottom: 8px;
  }

  input {
    width: 100%;
    padding: 8px 16px;
    border-radius: 4px;

    font-size: 13px;
    font-weight: 500;
    line-height: 23px;

    cursor: auto;

    border: 1px solid ${({ colors }) => colors.medium_grey25};
    background-color: ${({ colors, darkModus }) => (darkModus ? colors.dark_grey : colors.white)};
    color: ${({ colors, darkModus }) => (darkModus ? colors.white : colors.black)};

    &:focus-visible {
      outline: none;
      //border: 1px solid ${({ colors }) => colors.medium_grey25};
    }
  }
`;
