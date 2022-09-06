import * as React from 'react';
import styled from '@emotion/styled';
import { useState } from 'react';

interface TProps {
  className?: string;
  colors: any;
  title: string;
  placeholder?: string;
  value: string;
  onChange?: any;
}

const Textarea: React.FC<TProps> = ({ className, colors, title, placeholder, onChange, value }) => {
  return (
    <TextareaMain colors={colors} className={className}>
      <label htmlFor="Textarea">{title}</label>

      <textarea
        id="textarea"
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
};

const TextareaMain = styled.div<TNavProp>`
  label {
    font-size: 12px;
    font-weight: 700;
    line-height: 15px;
    color: ${({ colors }) => colors.medium_grey};
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
