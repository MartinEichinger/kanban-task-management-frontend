import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from './store/hooks';
import {
  getDatabaseEntries,
  IUpdateTask,
  IDatabaseBoard,
  updateTask,
  createTask,
  createBoard,
  updateBoard,
  deleteItems,
} from './store/taskSlices';
import { useThemeContext } from './ThemeProvider/ThemeProvider';
import { useSelectStatus } from './SelectStatusProvider/SelectStatusProvider';

import TaskModal from './Modals/TaskModal';
import NewTaskModal from './Modals/NewTaskModal';
import NewBoardModal from './Modals/NewBoardModal';
import DeleteModal from './Modals/DeleteModal';

import { LogoNavContentScreen } from './Layout/LogoNavContentScreen';
import Logo from './Logo/Logo';
import { Nav } from './Nav/Nav';
import { Content } from './Content/Content';
import Sidebar from './Sidebar';
import { useModalStatus } from './ModalStatusProvider/ModalStatusProvider';

import '@aws-amplify/ui-react/styles.css';
import { withAuthenticator, Button, Heading, Image, View, Card } from '@aws-amplify/ui-react';

const App = () => {
  // RETRIEVE DATA / THEME / DATA / SELECT STATUS / MODAL STATUS
  const dispatch = useAppDispatch();
  const { colors } = useThemeContext();
  const boards = useAppSelector((state) => state.taskData.boards);
  const {
    selectedBoard,
    selectedCol,
    selectedTask,
    setEditedTask,
    setEditedBoard,
    editedBoard,
    editedTask,
    setSelectedBoard,
    setSelectedCol,
    setSelectedTask,
    deleteTarget,
    setDeleteTarget,
  } = useSelectStatus();
  const boardSelected = selectedBoard > -1;
  const taskEdited = editedTask > -1;
  const {
    taskModalShow,
    setTaskModalShow,
    newTaskModalShow,
    setNewTaskModalShow,
    newBoardModalShow,
    setNewBoardModalShow,
    deleteModalShow,
    setDeleteModalShow,
  } = useModalStatus();
  const [sideBarCollapse, setSidebarCollapse] = useState(false);

  const debug = 2;

  // trigger database retrieve
  useEffect(() => {
    // get directus data
    dispatch(getDatabaseEntries());
  }, []);

  // METHODS
  const handleTaskMenuSelection = (sel: string, board: number, col: number, task: number) => {
    // close taskModal - set states for accessing newTaskModal (with existing data)
    // close taskModal - delete task data from data status
    if (debug >= 1) console.log('App/handleTaskMenuSelection: ', sel, board, col, task);

    setTaskModalShow(false);

    if (sel === 'edit') {
      setSelectedBoard(board);
      setSelectedCol(col);
      setSelectedTask(task);
      setEditedTask(task);
      setNewTaskModalShow(true);
    } else if (sel === 'delete') {
      setSelectedBoard(board);
      setSelectedCol(col);
      setSelectedTask(task);
      setDeleteTarget('task');
      setDeleteModalShow(true);
    }
  };

  // HTML
  return (
    <>
      <LogoNavContentScreen sideBarCollapse={sideBarCollapse}>
        <Logo />
        <Nav heading={boards?.[selectedBoard]?.name} />
        <Sidebar
          sidebarCollapse={sideBarCollapse}
          toggleSidebarCollapse={() => setSidebarCollapse(!sideBarCollapse)}
        />
        <Content />
      </LogoNavContentScreen>

      <TaskModal
        show={taskModalShow}
        onHide={() => setTaskModalShow(false)}
        boards={boards}
        handleMenuSelection={handleTaskMenuSelection}
        changeData={(val: IUpdateTask) => {
          dispatch(updateTask(val));
          setTaskModalShow(false);
        }}
      />
      <NewTaskModal
        show={newTaskModalShow}
        onHide={() => {
          setNewTaskModalShow(false);
          setEditedTask(-1);
        }}
        entriesSelect={boardSelected && boards[selectedBoard]?.columns}
        boards={boards}
        changeData={(val: any) => {
          taskEdited ? dispatch(updateTask(val)) : dispatch(createTask(val));
          setEditedTask(-1);
          setNewTaskModalShow(false);
        }}
      />
      <NewBoardModal
        show={newBoardModalShow}
        onHide={() => {
          setNewBoardModalShow(false);
          setEditedBoard(-1);
        }}
        changeData={(val: any) => {
          var id = boards?.[selectedBoard]?.id;
          if (val.edit > -1) {
            dispatch(updateBoard({ id: id, name: val.title, columns: val.columns }));
          } else {
            dispatch(createBoard({ id: -1, name: val.title, columns: val.columns }));
          }
          setNewBoardModalShow(false);
        }}
        boards={boards}
      />
      <DeleteModal
        show={deleteModalShow}
        onHide={() => {
          setDeleteModalShow(false);
        }}
        title={
          deleteTarget === 'board'
            ? boards?.[selectedBoard]?.name
            : boards?.[selectedBoard]?.columns?.[selectedCol]?.tasks[selectedTask]?.title
        }
        target={deleteTarget}
        onDelete={(val: any) => {
          deleteTarget === 'board'
            ? dispatch(
                deleteItems({
                  id: boards[selectedBoard].id,
                  arrNo: val.selectedBoard,
                  val: val,
                })
              )
            : dispatch(
                deleteItems({
                  id: boards[selectedBoard].columns[selectedCol].tasks[selectedTask].id,
                  arrNo: val.selectedTask,
                  val: val,
                })
              );
          setDeleteModalShow(false);
          //ResetData(deleteTarget);
        }}
      />
      {/*       <SidebarMenuModal
        colors={colors}
        show={showSidebarMenu}
        onHide={() => {
          setShowSidebarMenu(false);
          setMobilChevronDown(!mobilChevronDown);
        }}
        sidebarCollapse={sidebarCollapse}
        data={data}
        selectedBoard={selectedBoard}
        selectBoard={(val: any) => {
          setSelectedBoard(val);
          setShowSidebarMenu(false);
          setMobilChevronDown(!mobilChevronDown);
        }}
        setEditedBoard={setEditedBoard}
        setNewBoardModalShow={(val: boolean) => {
          setShowSidebarMenu(false);
          setMobilChevronDown(!mobilChevronDown);
          setNewBoardModalShow(val);
        }}
        ToggleSidebarCollapse={ToggleSidebarCollapse}
      /> */}
    </>
  );
};

export default withAuthenticator(App);
