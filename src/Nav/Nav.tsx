import React, { useState } from 'react';
import styled from '@emotion/styled';
import { ReactComponent as LogoMobile } from '../images/logo-mobile.svg';
import { ReactComponent as ArrowDown } from '../images/icon-chevron-down.svg';
import { ReactComponent as ArrowUp } from '../images/icon-chevron-up.svg';
import { ReactComponent as Cross } from '../images/icon-add-task-mobile.svg';
import { ReactComponent as Ellipsis } from '../images/icon-vertical-ellipsis.svg';
import pointer from '../images/pointer.png';

import { useModalStatus } from '../ModalStatusProvider/ModalStatusProvider';
import { useThemeContext } from '../ThemeProvider/ThemeProvider';
import { useSelectStatus } from '../SelectStatusProvider/SelectStatusProvider';

type TNav = {
  heading?: string;
};
export const Nav: React.FC<TNav> = ({ heading = '...board' }) => {
  // RETRIEVE DATA / THEME / SELECT STATUS / MODAL STATUS / LOCAL STATE
  const { theme, colors } = useThemeContext();
  const { selectedBoard, setEditedBoard, setDeleteTarget, resetStatus } = useSelectStatus();
  const boardSelected = selectedBoard > -1;
  const { setNewTaskModalShow, setShowSidebarMenu, setNewBoardModalShow, setDeleteModalShow } =
    useModalStatus();
  const [mobilChevronDown, setMobilChevronDown] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  const debug = 2;

  const onClickMenu = (sel: string) => {
    if (debug >= 1) console.log('Nav/onClickMenu: ', sel);

    setShowMenu(false);

    if (sel === 'edit') {
      setEditedBoard(selectedBoard);
      setNewBoardModalShow(true);
    } else if (sel === 'delete') {
      setDeleteTarget('board');
      setDeleteModalShow(true);
    }
  };

  if (debug > 1) console.log('Nav: ', theme, colors, boardSelected);

  return (
    <NavMain className="nav d-flex flex-row no-wrap" colors={colors} pointer={pointer}>
      <NavBar
        className={
          'navbar d-flex flex-row justify-content-around ' + theme.themeBg + ' ' + theme.themeBorder
        }
      >
        <LogoMobile className="d-flex d-sm-none mr-3 pointer" onClick={resetStatus} />
        <h1 className={'mr-sm-auto mr-2 ' + theme.themeHg}>{heading}</h1>
        <>
          <ArrowDown
            className={mobilChevronDown ? 'pointer d-sm-none mr-auto' : 'd-none'}
            onClick={() => {
              setMobilChevronDown(!mobilChevronDown);
              setShowSidebarMenu(true);
            }}
          />
          <ArrowUp
            className={!mobilChevronDown ? 'pointer d-sm-none mr-auto' : 'd-none'}
            onClick={() => {
              setMobilChevronDown(!mobilChevronDown);
              setShowSidebarMenu(false);
            }}
          />
        </>
        <button
          className="btn button large prim"
          id="add-task"
          disabled={!boardSelected}
          onClick={() => {
            console.log('newtask');
            setNewTaskModalShow(true);
          }}
        >
          <Cross className="d-sm-none" />
          <span className="d-none d-sm-inline">+ Add New Task</span>
        </button>
        <EllipsisBody
          className={boardSelected ? '' : 'disabled'}
          pointer={pointer}
          colors={colors}
          onClick={() => {
            boardSelected && setShowMenu(!showMenu);
          }}
        >
          <Ellipsis />
        </EllipsisBody>
      </NavBar>
      <ModalMenu
        className={theme.themeBgDark}
        colors={colors}
        pointer={pointer}
        showMenu={boardSelected ? showMenu : false}
      >
        <p className={theme.themeP} onClick={() => onClickMenu('edit')}>
          Edit Board
        </p>
        <p className={'red ' + theme.themeP} onClick={() => onClickMenu('delete')}>
          Delete Board
        </p>
      </ModalMenu>
    </NavMain>
  );
};

type TNavMain = {
  colors: any;
  pointer: any;
};
const NavMain = styled.div<TNavMain>`
  height: 100%;

  .navbar {
    padding: 29px 32px 37px;
    border-bottom: 1px solid white;
    border-top: 0px;
    width: 100%;

    @media (max-width: 575px) {
      width: 100vw;
      padding: 16px 16px 16px 16px;
    }

    #add-task {
      padding: 10px 18px;
      line-height: 12px;
    }
  }

  .pointer {
    cursor: url('${({ pointer }) => pointer}'), pointer;
  }
`;

const NavBar = styled.div``;

type TShowProp = {
  showMenu: any;
};
const ModalMenu = styled.div<TNavMain & TShowProp>`
  display: ${({ showMenu }) => (showMenu ? 'block' : 'none')};
  border: 1px solid grey;
  position: absolute;
  z-index: 10;
  right: 32px;
  top: 82px;
  padding: 0px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px 0px rgba(54, 78, 126, 0.1015);

  p {
    padding: 8px 16px;
    margin: 0px;

    &:last-of-type {
      border-radius: 0px 0px 8px 8px;
    }

    &:first-of-type {
      border-radius: 8px 8px 0px 0px;
    }

    &:hover {
      cursor: url('${({ pointer }) => pointer}'), pointer;
    }

    &.red {
      color: ${({ colors }) => colors.red};
    }
  }
`;

const EllipsisBody = styled.div<TNavMain>`
  border-radius: 50%;
  cursor: url('${({ pointer }) => pointer}'), pointer;
  padding: 1px 13px 5px;
  position: relative;
  z-index: 10;
  margin-left: 5px;

  /*   &.disabled:hover {
    background-color: ${({ colors }) => (1 ? colors.dark_grey : colors.white)};
  }

  &:hover {
    background-color: ${({ colors }) => (1 ? colors.very_dark_grey : colors.lighter_grey)};
  }
 */
`;
