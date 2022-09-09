import * as React from 'react';
import { useState } from 'react';
import styled from '@emotion/styled';
import Modal from 'react-bootstrap/Modal';
import Sidebar from './Sidebar';
import Checkbox from './Checkbox';
import Dropdown from './Dropdown';
import { ReactComponent as Ellipsis } from './images/icon-vertical-ellipsis.svg';
import pointer from './images/pointer.png';

interface TSelectionProp {
  selectedBoard: number;
  selectedCol: number;
  selectedTask: number;
}

interface TModalProp {
  show: any;
  onHide: any;
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

const SidebarMenuModal: React.FC<TModalProp> = ({
  className,
  show,
  onHide,
  colors,
  sidebarCollapse,
  data,
  selectedBoard,
  selectBoard,
  setEditedBoard,
  setNewBoardModalShow,
  ToggleSidebarCollapse,
}) => {
  const debug = 0;

  return (
    <SidebarMenuModalMain
      colors={colors}
      pointer={pointer}
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <SidebarSMM
          colors={colors}
          sidebarCollapse={sidebarCollapse}
          data={data}
          selectedBoard={selectedBoard}
          selectBoard={selectBoard}
          setEditedBoard={setEditedBoard}
          setNewBoardModalShow={setNewBoardModalShow}
          ToggleSidebarCollapse={ToggleSidebarCollapse}
        />
      </Modal.Body>
    </SidebarMenuModalMain>
  );
};

export default SidebarMenuModal;

type TNavProp = {
  colors: any;
};

type TPointerProp = {
  pointer: any;
};

const SidebarMenuModalMain = styled(Modal)<TNavProp & TPointerProp>`
  width: 300px;

  .modal-content {
    position: absolute;
    top: 120px;
  }

  .modal-body {
    padding: 16px 24px 16px 0px;
  }
`;

const SidebarSMM = styled(Sidebar)<TNavProp>`
  &.collapsed {
    width: 300px;
  }
`;
