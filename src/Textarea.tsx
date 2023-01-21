import * as React from 'react';
import styled from '@emotion/styled';
import { useAppSelector } from './store/hooks';
import { useState } from 'react';
import { useThemeContext } from './ThemeProvider/ThemeProvider';

interface TProps {
  className?: string;
  colors: any;
  title: string;
  placeholder?: string;
  value: string;
  onChange?: any;
}

const Textarea: React.FC<TProps> = ({ className, colors, title, placeholder, onChange, value }) => {
  const theme = useThemeContext();

  return (
    <TextareaMain colors={colors} className={className}>
      <label htmlFor="Textarea" className={theme.theme.themeTypoGrey}>
        {title}
      </label>

      <textarea
        id="textarea"
        className={theme.theme.themeBg + ' ' + theme.theme.themeTypoDark}
        rows={4}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      ></textarea>
    </TextareaMain>
  );
};

export default Textarea;

type TNavProp = {
  colors: any;
  darkModus?: any;
};

const TextareaMain = styled.div<TNavProp>`
  label {
    font-size: 12px;
    font-weight: 700;
    line-height: 15px;
    margin-bottom: 8px;
  }

  textarea {
    width: 100%;
    padding: 8px 16px;
    border-radius: 4px;

    font-size: 13px;
    font-weight: 500;
    line-height: 23px;

    cursor: auto;

    border: 1px solid ${({ colors }) => colors.medium_grey25};

    &:focus-visible {
      outline: none;
      //border: 1px solid ${({ colors }) => colors.medium_grey25};
    }
  }
`;
