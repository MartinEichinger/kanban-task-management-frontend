import styled from '@emotion/styled';
import { useThemeContext } from '../ThemeProvider/ThemeProvider';
import { useSelectStatus } from '../SelectStatusProvider/SelectStatusProvider';

import { ReactComponent as LogoDark } from '../images/logo-dark.svg';
import { ReactComponent as LogoLight } from '../images/logo-light.svg';
import pointer from '../images/pointer.png';

const Logo = () => {
  const { theme, status } = useThemeContext();
  const themeLight = status === 'light';
  const { resetStatus } = useSelectStatus();

  return (
    <LogoMain
      className={'logo ' + theme.themeBg + ' ' + theme.themeBorder}
      onClick={() => resetStatus()}
      pointer={pointer}
    >
      {themeLight ? <LogoDark /> : <LogoLight />}
    </LogoMain>
  );
};

export default Logo;

type TLogoMain = {
  pointer: any;
};
const LogoMain = styled.div<TLogoMain>`
  height: 100%;
  padding: 35px 24px;
  border: 1px solid white;
  border-top: 0px;
  border-left: 0px;
  cursor: url('${({ pointer }) => pointer}'), pointer;
`;
