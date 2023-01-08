import styled from '@emotion/styled';
import { ReactComponent as LightIcon } from './images/icon-light-theme.svg';
import { ReactComponent as DarkIcon } from './images/icon-dark-theme.svg';

interface TProps {
  className?: string;
  colors: any;
  onChange: any;
}

const ToggleDarkModus: React.FC<TProps> = ({ className, colors, onChange }) => {
  return (
    <ToggleDarkComponent
      className={className + ' d-flex flex-row justify-content-center align-items-center'}
      colors={colors}
    >
      <LightIcon />
      <Switch className="custom-control custom-switch" colors={colors} onChange={(e) => onChange(e)}>
        <input type="checkbox" className="custom-control-input" id="customSwitch1" />
        <label className="custom-control-label" htmlFor="customSwitch1"></label>
      </Switch>
      <DarkIcon />
    </ToggleDarkComponent>
  );
};

export default ToggleDarkModus;

type TColorProp = {
  colors: any;
};

const ToggleDarkComponent = styled.div<TColorProp>`
  height: 48px;
  border-radius: 6px;
  margin: 8px 24px;
  background-color: ${({ colors }) => colors.light_grey};
`;

const Switch = styled.div<TColorProp>`
  margin-left: 24px;
  margin-right: 24px;

  .custom-control-input:focus ~ .custom-control-label::before {
    border-color: ${({ colors }) => colors.main_purple};
    box-shadow: 0 0 0 0rem ${({ colors }) => colors.main_purple25};
  }
  .custom-control-input:checked ~ .custom-control-label::before {
    border-color: ${({ colors }) => colors.main_purple};
    background-color: ${({ colors }) => colors.main_purple};
  }
  .custom-control-input:active ~ .custom-control-label::before {
    background-color: ${({ colors }) => colors.main_purple};
    border-color: ${({ colors }) => colors.main_purple};
  }
  .custom-control-input:focus:not(:checked) ~ .custom-control-label::before {
    /* border-color: ${({ colors }) => colors.main_purple};
    background-color: ${({ colors }) => colors.main_purple}; */
  }
`;
