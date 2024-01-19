import * as React from 'react';
import styled from '@emotion/styled';
import pointer from './images/pointer.png';
import ToggleDarkModus from './ToggleDarkModus';
import { ReactComponent as SidebarIcon } from './images/icon-board.svg';
import { ReactComponent as HideIcon } from './images/icon-hide-sidebar.svg';
import { useThemeContext } from './ThemeProvider/ThemeProvider';
import { useSelectStatus } from './SelectStatusProvider/SelectStatusProvider';
import { useAppSelector } from './store/hooks';
import { useModalStatus } from './ModalStatusProvider/ModalStatusProvider';

interface TProps {
  className?: string;
  sidebarCollapse?: boolean;
  toggleSidebarCollapse?: any;
}

const Sidebar: React.FC<TProps> = ({ className, sidebarCollapse = false, toggleSidebarCollapse }) => {
  const { theme, colors, toggleTheme } = useThemeContext();
  const boards = useAppSelector((state) => state.taskData.boards);
  const { selectedBoard, setSelectedBoard, setEditedBoard } = useSelectStatus();
  const { setNewBoardModalShow } = useModalStatus();
  const debug = 2;

  if (debug > 1) console.log('Sidebar/beforeRender: ', boards, selectedBoard);

  return (
    <SidebarMain
      className={
        sidebarCollapse
          ? `${className} sidebar collapsed d-flex flex-column justify-content-between ` +
            theme.themeBg +
            ' ' +
            theme.themeBorder
          : `${className} sidebar d-flex flex-column justify-content-between ` +
            theme.themeBg +
            ' ' +
            theme.themeBorder
      }
      colors={colors}
      pointer={pointer}
    >
      <div className="upper d-flex flex-column h-100">
        <h3 className={'sidebar-heading '}>ALL BOARDS ({boards?.length})</h3>
        {boards?.map((item: any, i: any) => {
          return (
            <div
              className={
                selectedBoard === i
                  ? 'nav-item d-flex flex-row align-items-center active '
                  : 'nav-item d-flex flex-row align-items-center ' + theme.themeHoverLight
              }
              onClick={() => setSelectedBoard(i)}
              key={i}
            >
              <SidebarIcon />
              <h3>{item.name}</h3>
            </div>
          );
        })}
        <div
          className="nav-item-plus d-flex flex-row align-items-center mb-auto"
          onClick={() => {
            setEditedBoard(-1);
            setNewBoardModalShow(true);
          }}
        >
          <SidebarIcon />
          <h3>+ Create New Board</h3>
        </div>
        {!sidebarCollapse && (
          <ToggleDarkModus
            className={'toggle-dark-modus ' + theme.themeBgDark2}
            colors={colors}
            onChange={(e: any) => {
              toggleTheme();
            }}
          />
        )}
      </div>
      <div className="lower d-none d-sm-flex flex-column">
        <div
          className={
            sidebarCollapse
              ? 'nav-item marker collapsed d-flex flex-row align-items-center'
              : 'nav-item marker d-flex flex-row align-items-center'
          }
          onClick={toggleSidebarCollapse}
        >
          <HideIcon />
          {!sidebarCollapse && <h3>HideSidebar</h3>}
        </div>
      </div>
    </SidebarMain>
  );
};

export default Sidebar;

type TColorProp = {
  colors: any;
  darkModus?: any;
};

type TPointerProp = {
  pointer: any;
};

const SidebarMain = styled.div<TColorProp & TPointerProp>`
  width: 100%;
  height: 100%;
  padding-bottom: 80px;
  border-right: 1px solid white;

  &.collapsed {
    width: 0px;
  }

  .sidebar-heading {
    padding: 14px 93px 15px 32px;
    color: ${({ colors }) => colors.medium_grey}};
  }

  .nav-item {
    padding: 14px 0px 15px 32px;
    margin-right: 24px;
    margin-bottom: 2px;
    border-radius: 0px 100px 100px 0px;
    color: ${({ colors }) => colors.medium_grey};
    cursor: url('${({ pointer }) => pointer}'), pointer;

    &:hover {
      color: ${({ colors }) => colors.main_purple};

      svg path {
        fill: ${({ colors }) => colors.main_purple};
      }
    }

    &.active {
      background-color: ${({ colors }) => colors.main_purple};
      color: white;

      svg path {
        fill: white;
      }
    }

    &.marker {
      position: fixed;
      bottom: 32px;
      width: 275px;

      &.collapsed {
        width: 58px;
        padding: 16px 22px 16px 18px;
        background-color: ${({ colors }) => colors.main_purple};

        &:hover {
          background-color: ${({ colors }) => colors.main_purple_hover};
        }

        svg path {
          fill: white;
        }
      }
    }

    h3 {
      margin-bottom: 0px;
      margin-left: 16px;
    }

    svg {
      path {
        fill: ${({ colors }) => colors.medium_grey};
      }
    }
  }

  .nav-item-plus {
    padding: 14px 0px 15px 32px;
    border-radius: 0px 20px 20px 0px;
    cursor: url('${({ pointer }) => pointer}'), pointer;
    color: ${({ colors }) => colors.main_purple};

    &:hover {
    }

    h3 {
      margin-bottom: 0px;
      margin-left: 16px;
    }

    svg {
      path {
        fill: ${({ colors }) => colors.main_purple};
      }
    }
  }
`;
