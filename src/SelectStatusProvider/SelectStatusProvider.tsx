import React, { useState, useContext } from 'react';

type TSelectStatusContext = {
  selectedBoard: number;
  editedBoard: number;
  selectedCol: number;
  selectedTask: number;
  editedTask: number;
  deleteTarget: string;
  setSelectedBoard: (val: number) => void;
  setEditedBoard: (val: number) => void;
  setSelectedCol: (val: number) => void;
  setSelectedTask: (val: number) => void;
  setEditedTask: (val: number) => void;
  resetStatus: () => void;
  setDeleteTarget: (val: string) => void;
};

const defaultValue = {
  selectedBoard: -1,
  editedBoard: -1,
  selectedCol: -1,
  selectedTask: -1,
  editedTask: -1,
  deleteTarget: '',
  setSelectedBoard: () => {},
  setEditedBoard: () => {},
  setSelectedCol: () => {},
  setSelectedTask: () => {},
  setEditedTask: () => {},
  resetStatus: () => {},
  setDeleteTarget: () => {},
};

export const SelectStatusContext = React.createContext<TSelectStatusContext>(defaultValue);

// Define Select Status Provider
type TSelectStatusProvider = {
  children?: any;
};
export const SelectStatusProvider: React.FC<TSelectStatusProvider> = ({ children }) => {
  const [selectedBoard, setSelectedBoard] = useState(-1);
  const [editedBoard, setEditedBoard] = useState(-1);
  const [selectedCol, setSelectedCol] = useState(-1);
  const [selectedTask, setSelectedTask] = useState(-1);
  const [editedTask, setEditedTask] = useState(-1);
  const [deleteTarget, setDeleteTarget] = useState('');

  /*   const selectBoard = (val: number) => setSelectedBoard(val);
  const editBoard = (val: number) => setEditedBoard(val);
  const selectCol = (val: number) => setSelectedCol(val);
  const selectTask = (val: number) => setSelectedTask(val);
  const editTask = (val: number) => setEditedTask(val); */

  const resetStatus = () => {
    setSelectedBoard(-1);
    setEditedBoard(-1);
    setSelectedCol(-1);
    setSelectedTask(-1);
    setEditedTask(-1);
    setDeleteTarget('');
  };

  const providerValue = {
    selectedBoard,
    editedBoard,
    selectedCol,
    selectedTask,
    editedTask,
    deleteTarget,
    setSelectedBoard,
    setEditedBoard,
    setSelectedCol,
    setSelectedTask,
    setEditedTask,
    resetStatus,
    setDeleteTarget,
  };

  //console.log('themeprovider: ', providerValue, light, dark);
  return <SelectStatusContext.Provider value={providerValue}>{children}</SelectStatusContext.Provider>;
};

export const useSelectStatus = () => {
  const selectStatus = useContext(SelectStatusContext);

  return selectStatus;
};
