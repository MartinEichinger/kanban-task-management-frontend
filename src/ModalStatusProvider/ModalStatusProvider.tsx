import React, { useContext, useState } from 'react';

const debug = 2;

type TModalStatusContext = {
  taskModalShow: boolean;
  setTaskModalShow: (val: boolean) => void;
  newTaskModalShow: boolean;
  setNewTaskModalShow: (val: boolean) => void;
  newBoardModalShow: boolean;
  setNewBoardModalShow: (val: boolean) => void;
  deleteModalShow: boolean;
  setDeleteModalShow: (val: boolean) => void;
  showSidebarMenu: boolean;
  setShowSidebarMenu: (val: boolean) => void;
};

const defaultValue = {
  taskModalShow: false,
  setTaskModalShow: () => {},
  newTaskModalShow: false,
  setNewTaskModalShow: () => {},
  newBoardModalShow: false,
  setNewBoardModalShow: () => {},
  deleteModalShow: false,
  setDeleteModalShow: () => {},
  showSidebarMenu: false,
  setShowSidebarMenu: () => {},
};

export const ModalStatusContext = React.createContext<TModalStatusContext>(defaultValue);

type TModalStatusProvider = {
  children?: any;
};
export const ModalStatusProvider: React.FC<TModalStatusProvider> = ({ children }) => {
  const [taskModalShow, setTaskModalShow] = useState(false);
  const [newTaskModalShow, setNewTaskModalShow] = useState(false);
  const [newBoardModalShow, setNewBoardModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [showSidebarMenu, setShowSidebarMenu] = useState(false);

  if (debug > 0)
    console.log(
      'ModalStatusLogging: ',
      taskModalShow,
      newTaskModalShow,
      newBoardModalShow,
      deleteModalShow,
      showSidebarMenu
    );
  const providerValue = {
    taskModalShow,
    setTaskModalShow,
    newTaskModalShow,
    setNewTaskModalShow,
    newBoardModalShow,
    setNewBoardModalShow,
    deleteModalShow,
    setDeleteModalShow,
    showSidebarMenu,
    setShowSidebarMenu,
  };

  return <ModalStatusContext.Provider value={providerValue}>{children}</ModalStatusContext.Provider>;
};

export const useModalStatus = () => {
  const modalStatus = useContext(ModalStatusContext);
  return modalStatus;
};
