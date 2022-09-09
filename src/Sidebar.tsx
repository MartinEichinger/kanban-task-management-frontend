import * as React from 'react';
import styled from '@emotion/styled';
import pointer from './images/pointer.png';
import { ReactComponent as SidebarIcon } from './images/icon-board.svg';
import { ReactComponent as HideIcon } from './images/icon-hide-sidebar.svg';

interface TProps {
  className?: string;
  colors: any;
  sidebarCollapse: boolean;
  data: any;
  selectedBoard: number;
  selectBoard: any;
  setEditedBoard: any;
  setNewBoardModalShow: any;
  ToggleSidebarCollapse: any;
}

const Sidebar: React.FC<TProps> = ({
  className,
  colors,
  sidebarCollapse,
  data,
  selectedBoard,
  selectBoard,
  setEditedBoard,
  setNewBoardModalShow,
  ToggleSidebarCollapse,
}) => {
  return (
    <SidebarMain
      className={
        sidebarCollapse
          ? `${className} sidebar collapsed d-flex flex-column justify-content-between`
          : `${className} sidebar d-flex flex-column justify-content-between`
      }
      colors={colors}
      pointer={pointer}
    >
      <div className="upper d-flex flex-column">
        <h3 className="sidebar-heading">ALL BOARDS ({data.boards?.length})</h3>
        {data.boards?.map((item: any, i: any) => {
          return (
            <div
              className={
                selectedBoard === i
                  ? 'nav-item d-flex flex-row align-items-center active'
                  : 'nav-item d-flex flex-row align-items-center'
              }
              onClick={() => selectBoard(i)}
              key={i}
            >
              <SidebarIcon />
              <h3>{item.name}</h3>
            </div>
          );
        })}
        <div
          className="nav-item-plus d-flex flex-row align-items-center"
          onClick={() => {
            setEditedBoard(-1);
            setNewBoardModalShow(true);
          }}
        >
          <SidebarIcon />
          <h3>+ Create New Board</h3>
        </div>
      </div>
      <div className="lower d-none d-sm-flex flex-column">
        <div
          className={
            sidebarCollapse
              ? 'nav-item marker collapsed d-flex flex-row align-items-center'
              : 'nav-item marker d-flex flex-row align-items-center'
          }
          onClick={ToggleSidebarCollapse}
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
};

type TPointerProp = {
  pointer: any;
};

const SidebarMain = styled.div<TColorProp & TPointerProp>`
  width: 300px;
  margin-bottom: 32px;
  border-right: 1px solid ${({ colors }) => colors.lines_light};

  &.collapsed {
    width: 0px;
  }

  .sidebar-heading {
    padding: 14px 93px 15px 32px;
  }

  .nav-item {
    padding: 14px 0px 15px 32px;
    margin-right: 24px;
    margin-bottom: 2px;
    border-radius: 0px 100px 100px 0px;
    color: ${({ colors }) => colors.medium_grey};
    cursor: url('${({ pointer }) => pointer}'), pointer;

    &:hover {
      background-color: ${({ colors }) => colors.main_purple10};
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
