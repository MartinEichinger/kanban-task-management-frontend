import React from 'react';
import { useEffect, useState, useRef } from 'react';
import styled from '@emotion/styled';
import { ReactComponent as Logo } from './images/logo-dark.svg';
import { ReactComponent as LogoMobile } from './images/logo-mobile.svg';
import { ReactComponent as Ellipsis } from './images/icon-vertical-ellipsis.svg';
import { ReactComponent as ArrowDown } from './images/icon-chevron-down.svg';
import { ReactComponent as ArrowUp } from './images/icon-chevron-up.svg';
import { ReactComponent as Cross } from './images/icon-add-task-mobile.svg';

import pointer from './images/pointer.png';
import TaskModal from './TaskModal';
import NewTaskModal from './NewTaskModal';
import NewBoardModal from './NewBoardModal';
import DeleteModal from './DeleteModal';
import SidebarMenuModal from './SidebarMenuModal';
import Sidebar from './Sidebar';

const colors = {
  lines_light: 'rgba(228,235,250,1)',
  main_purple: 'rgba(99, 95, 199, 1)',
  main_purple25: 'rgba(99, 95, 199, 0.25)',
  main_purple10: 'rgba(99, 95, 199, 0.1)',
  main_purple_hover: 'rgba(168, 164, 255, 1)',
  main_purple_light: 'rgba(99, 95, 199, 0.1)',
  main_purple_light_hover: 'rgba(99, 95, 199, 0.25)',
  medium_grey: 'rgba(130,143,163,1)',
  medium_grey25: 'rgba(130,143,163,0.25)',
  light_grey: 'rgba(244,247,253,1)',
  lighter_grey: 'rgba(233, 239, 250, 1)',
  red: 'rgba(234,85,85,1)',
  black: 'rgba(0,1,18,1)',
  black50: 'rgba(0,1,18,0.5)',
};

function App() {
  type TDataProp = {
    boards: {
      name: string;
      columns: {
        name: string;
        tasks: {
          title: string;
          description: string;
          status: string;
          subtasks: {
            title: string;
            isCompleted: boolean;
          }[];
        }[];
      }[];
    }[];
  };

  const winRef = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState(winRef.current?.clientWidth);
  const [height, setHeight] = useState(winRef.current?.clientHeight);
  const [taskModalShow, setTaskModalShow] = useState(false);
  const [newTaskModalShow, setNewTaskModalShow] = useState(false);
  const [newBoardModalShow, setNewBoardModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [showSidebarMenu, setShowSidebarMenu] = useState(false);

  const [showMenu, setShowMenu] = useState(false);
  const [mobilChevronDown, setMobilChevronDown] = useState(true);

  const [data, setData] = useState<TDataProp>({} as TDataProp);
  const [deleteTarget, setDeleteTarget] = useState('');
  const [selectedBoard, setSelectedBoard] = useState(-1);
  const [editedBoard, setEditedBoard] = useState(-1);
  const [selectedCol, setSelectedCol] = useState(-1);
  const [selectedTask, setSelectedTask] = useState(-1);
  const [editedTask, setEditedTask] = useState(-1);
  const [sidebarCollapse, setSidebarCollapse] = useState(false);

  const debug = 1;

  useEffect(() => {
    // Fetch JSON data
    fetch('./data.json')
      .then((response) => response.json())
      .then((json) => {
        console.log('App/useEffect: ', json);
        setData(json);
      });
    getWinSize();
    window.addEventListener('resize', getWinSize);
  }, []);

  const getWinSize = () => {
    const newWidth: any = winRef.current?.clientWidth;
    setWidth(newWidth);

    const newHeight: any = winRef.current?.clientHeight;
    setHeight(newHeight);

    newWidth < 576 ? setSidebarCollapse(true) : setSidebarCollapse(false);
  };

  const ResetData = () => {
    setTaskModalShow(false);
    setNewTaskModalShow(false);
    setNewBoardModalShow(false);
    setDeleteModalShow(false);
    setShowMenu(false);
    setDeleteTarget('');
    setSelectedBoard(-1);
    setEditedBoard(-1);
    setSelectedCol(-1);
    setSelectedTask(-1);
    setEditedTask(-1);
    if (width !== undefined && width < 576) {
      setSidebarCollapse(true);
    } else {
      setSidebarCollapse(false);
    }
  };

  const onClickMenu = (sel: string) => {
    setShowMenu(false);
    if (sel === 'edit') {
      handleBoardMenuSelection('edit', selectedBoard);
    } else {
      handleBoardMenuSelection('delete', selectedBoard);
    }
  };

  const handleBoardMenuSelection = (sel: string, board: number) => {
    // set states for accessing newBoardModal (with existing data)
    // delete task data from data status
    if (debug >= 1) console.log('App/handleBoardMenuSelection: ', sel, board);

    if (sel === 'edit') {
      setSelectedBoard(board);
      setEditedBoard(board);
      setNewBoardModalShow(true);
    } else if (sel === 'delete') {
      setSelectedBoard(board);
      setDeleteTarget('board');
      setDeleteModalShow(true);
    }
  };

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

  const ToggleSidebarCollapse = () => {
    sidebarCollapse ? setSidebarCollapse(false) : setSidebarCollapse(true);
  };

  const selectBoard = (num: number) => {
    if (debug >= 0) console.log('selectBoard: ', num);
    setSelectedBoard(num);
  };

  const selectTask = (col: number, task: number) => {
    if (debug >= 0) console.log('selectColumn: ', col);
    if (debug >= 0) console.log('selectTask: ', task);
    setSelectedCol(col);
    setSelectedTask(task);
    setTaskModalShow(true);
  };

  const ChangeData = (
    operation: any,
    selectedBoard: any,
    selectedCol?: any,
    selectedTask?: any,
    selectedSubtask?: any,
    val?: any
  ) => {
    console.log('changeData: ', selectedBoard, selectedCol, selectedTask, selectedSubtask, val);
    const obj = { ...data };
    console.log('start obj: ', obj);
    // status of subtask
    if (operation === 'subtask') {
      obj.boards[selectedBoard].columns[selectedCol].tasks[selectedTask].subtasks[
        selectedSubtask
      ].isCompleted = val;
      setData(obj);
    } else if (operation === 'task') {
      setTaskModalShow(false);
      // assign new status to selected task
      obj.boards[selectedBoard].columns[selectedCol].tasks[selectedTask].status = val;
      console.log('obj 1: ', obj);
      // copy selected task
      var cut = obj.boards[selectedBoard].columns[selectedCol].tasks[selectedTask];
      console.log('cut 2: ', cut);
      // delete selected task from column
      obj.boards[selectedBoard].columns[selectedCol].tasks.splice(selectedTask, 1);
      console.log('obj 3: ', obj);
      // push selected task to new column
      obj.boards[selectedBoard].columns.map((col) => {
        if (col.name === val) {
          col.tasks.push(cut);
        }
      });
      console.log('end obj: ', obj);
      setData(obj);
    } else if (operation === 'delete-task') {
      obj.boards[selectedBoard].columns[selectedCol].tasks.splice(selectedTask, 1);
      setDeleteModalShow(false);
    } else if (operation === 'delete-board') {
      obj.boards.splice(selectedBoard, 1);
      setDeleteModalShow(false);
      ResetData();
    }
  };

  const AddNewTask = (
    title: string,
    description: string,
    subtasks: any,
    status: string,
    edit: number[]
  ) => {
    // copy data -> when edit task: change values for title, descr, status and subtasks (differ between changed and new subtasks) -> write new data
    // copy data -> when new task: generate newTask obj -> copy newTask into correct column -> write new data
    if (debug >= 1) console.log('App/AddNewTask/in: ', title, description, subtasks, status);
    var newDataList = data;

    if (edit[2] > -1) {
      newDataList.boards[edit[0]].columns[edit[1]].tasks[edit[2]].title = title;
      newDataList.boards[edit[0]].columns[edit[1]].tasks[edit[2]].description = description;
      newDataList.boards[edit[0]].columns[edit[1]].tasks[edit[2]].status = status;
      newDataList.boards[edit[0]].columns[edit[1]].tasks[edit[2]].subtasks.map((task, i) => {
        return (task.title = subtasks[i]);
      });
      for (
        let i = newDataList.boards[edit[0]].columns[edit[1]].tasks[edit[2]].subtasks.length;
        i < subtasks.length;
        i++
      ) {
        newDataList.boards[edit[0]].columns[edit[1]].tasks[edit[2]].subtasks.push({
          title: subtasks[i],
          isCompleted: false,
        });
      }
    } else {
      var newTask = {
        title: title,
        description: description,
        status: status,
        subtasks: subtasks.map((subtask: any, i: any) => {
          return {
            title: subtask,
            isCompleted: false,
          };
        }),
      };
      console.log('App/AddNewTask/task: ', newTask);
      newDataList.boards[selectedBoard].columns.map((colName, i) => {
        if (colName.name === status) {
          return newDataList.boards[selectedBoard].columns[i].tasks.push(newTask);
        }
      });
    }

    console.log('App/AddNewTask/data: ', newDataList);
    setData(newDataList);
    setEditedTask(-1);
    setNewTaskModalShow(false);
  };

  const AddNewBoard = (title: string, columns: any, edit: number) => {
    if (debug >= 1) console.log('App/AddNewBoard/in: ', title, columns, edit);
    var newDataList = data;
    if (edit > -1) {
      newDataList.boards[edit].name = title;
      newDataList.boards[edit].columns.map((col, i) => {
        return (col.name = columns[i]);
      });
      for (let i = newDataList.boards[edit].columns.length; i < columns.length; i++) {
        newDataList.boards[edit].columns.push({ name: columns[i], tasks: [] });
      }
    } else {
      var newBoard = {
        name: title,
        columns: columns.map((col: any, i: any) => {
          return {
            name: col,
            tasks: [],
          };
        }),
      };
      console.log('App/AddNewBoard/cols: ', newBoard);

      newDataList.boards.push(newBoard);
    }
    console.log('App/AddNewBoard/data: ', newDataList);
    setData(newDataList);
    setNewBoardModalShow(false);
  };

  const RenderContent = () => {
    var obj = data.boards[selectedBoard];

    return (
      <Columns
        className="d-flex flex-row justify-content-start align-items-start"
        colors={colors}
        pointer={pointer}
      >
        {obj.columns?.map((item, i) => {
          return (
            <div className="column d-flex flex-column" key={i}>
              <h4 className="d-flex flex-row align-items-center">
                <span className={'circle c' + i}></span>
                {item.name} ({item.tasks.length})
              </h4>
              <div>
                {item.tasks.map((task, j) => {
                  var completed = task.subtasks.filter((subtask) => {
                    return subtask.isCompleted === true;
                  });
                  return (
                    <Task
                      type="button"
                      className="task"
                      onClick={() => selectTask(i, j)}
                      key={j}
                      pointer={pointer}
                      colors={colors}
                    >
                      <h3>{task.title}</h3>
                      <p className="bold">
                        {completed.length} of {task.subtasks.length} subtasks
                      </p>
                    </Task>
                  );
                })}
              </div>
            </div>
          );
        })}
        <div
          className="column add-col d-flex flex-column justify-content-center align-items-center"
          onClick={() => {
            setEditedBoard(selectedBoard);
            setNewBoardModalShow(true);
          }}
        >
          <h1>+ New Column</h1>
        </div>
      </Columns>
    );
  };

  return (
    <div className="App" ref={winRef}>
      <div className="frame d-flex flex-column">
        <Nav className="nav d-flex flex-row" colors={colors} pointer={pointer}>
          <div className="d-none d-sm-block logo" onClick={ResetData}>
            <Logo />
          </div>
          <div className="navbar d-flex flex-row justify-content-around">
            <LogoMobile className="d-flex d-sm-none mr-3 pointer" onClick={ResetData} />
            <h1 className="mr-sm-auto mr-2">
              {selectedBoard > -1 ? data.boards?.[selectedBoard]?.name : '...board'}
            </h1>
            <ArrowDown
              className={mobilChevronDown ? 'pointer mr-auto' : 'd-none'}
              onClick={() => {
                setMobilChevronDown(!mobilChevronDown);
                setShowSidebarMenu(true);
              }}
            />
            <ArrowUp
              className={!mobilChevronDown ? 'pointer mr-auto' : 'd-none'}
              onClick={() => {
                setMobilChevronDown(!mobilChevronDown);
                setShowSidebarMenu(false);
              }}
            />
            <button
              className="btn large prim"
              id="add-task"
              disabled={selectedBoard === -1}
              onClick={() => setNewTaskModalShow(true)}
            >
              {width !== undefined && width < 576 && <Cross />}
              <span className="d-none d-sm-inline">+ Add New Task</span>
            </button>
            <EllipsisBody
              className={selectedBoard > -1 ? '' : 'disabled'}
              pointer={pointer}
              colors={colors}
              onClick={() => {
                selectedBoard > -1 && setShowMenu(!showMenu);
              }}
            >
              <Ellipsis />
            </EllipsisBody>
          </div>
          <ModalMenu colors={colors} pointer={pointer} showMenu={selectedBoard > -1 ? showMenu : false}>
            <p onClick={() => onClickMenu('edit')}>Edit Board</p>
            <p className="red" onClick={() => onClickMenu('delete')}>
              Delete Board
            </p>
          </ModalMenu>
        </Nav>
        <Main className="main  d-flex flex-row">
          <Sidebar
            colors={colors}
            sidebarCollapse={sidebarCollapse}
            data={data}
            selectedBoard={selectedBoard}
            selectBoard={selectBoard}
            setEditedBoard={setEditedBoard}
            setNewBoardModalShow={setNewBoardModalShow}
            ToggleSidebarCollapse={ToggleSidebarCollapse}
          />

          <Content colors={colors} pointer={pointer} className={sidebarCollapse ? 'collapsed' : ''}>
            {selectedBoard > -1 ? (
              <div className="content d-flex flex-column justify-content-start align-items-start">
                <RenderContent />
              </div>
            ) : (
              <div className="content d-flex flex-column justify-content-center align-items-center">
                <h2>
                  This board is empty. Create a new column to get started. {width} / {height}
                </h2>
                <button className="btn large prim" disabled={selectedBoard === -1}>
                  + Add New Column
                </button>
              </div>
            )}
          </Content>
        </Main>
      </div>

      <TaskModal
        colors={colors}
        show={taskModalShow}
        onHide={() => setTaskModalShow(false)}
        boards={data}
        selection={{
          selectedBoard: selectedBoard,
          selectedCol: selectedCol,
          selectedTask: selectedTask,
        }}
        changeData={ChangeData}
        handleMenuSelection={handleTaskMenuSelection}
      />
      <NewTaskModal
        colors={colors}
        show={newTaskModalShow}
        onHide={() => {
          setNewTaskModalShow(false);
          setEditedTask(-1);
        }}
        entriesSelect={selectedBoard > -1 && data.boards[selectedBoard].columns}
        edit={[selectedBoard, selectedCol, editedTask]}
        data={data}
        changeData={AddNewTask}
      />
      <NewBoardModal
        colors={colors}
        show={newBoardModalShow}
        onHide={() => {
          console.log('onHide New BoardModal');
          setNewBoardModalShow(false);
          setEditedBoard(-1);
        }}
        changeData={AddNewBoard}
        edit={editedBoard}
        data={data}
      />
      <DeleteModal
        colors={colors}
        show={deleteModalShow}
        onHide={() => {
          console.log('onHide DeleteModal');
          setDeleteModalShow(false);
        }}
        selection={{ selectedBoard, selectedCol, selectedTask }}
        title={
          deleteTarget === 'board'
            ? data.boards?.[selectedBoard]?.name
            : data.boards?.[selectedBoard]?.columns?.[selectedCol]?.tasks[selectedTask]?.title
        }
        target={deleteTarget}
        onDelete={ChangeData}
      />
      <SidebarMenuModal
        colors={colors}
        show={showSidebarMenu}
        onHide={() => {
          console.log('onHide SidebarMenuModal');
          setShowSidebarMenu(false);
          setMobilChevronDown(!mobilChevronDown);
        }}
        sidebarCollapse={sidebarCollapse}
        data={data}
        selectedBoard={selectedBoard}
        selectBoard={(val: any) => {
          selectBoard(val);
          setShowSidebarMenu(false);
          setMobilChevronDown(!mobilChevronDown);
        }}
        setEditedBoard={setEditedBoard}
        setNewBoardModalShow={setNewBoardModalShow}
        ToggleSidebarCollapse={ToggleSidebarCollapse}
      />
    </div>
  );
}

export default App;

type TColorProp = {
  colors: any;
};

type TPointerProp = {
  pointer: any;
};

type TShowProp = {
  showMenu: any;
};

type TNavProp = TColorProp & TPointerProp;

const ModalMenu = styled.div<TNavProp & TShowProp>`
  display: ${({ showMenu }) => (showMenu ? 'block' : 'none')};
  border: 1px solid grey;
  position: absolute;
  z-index: 10;
  right: 32px;
  top: 82px;
  padding: 0px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px 0px rgba(54, 78, 126, 0.1015);
  background-color: white;

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
      background-color: ${({ colors }) => colors.light_grey};
      cursor: url('${({ pointer }) => pointer}'), pointer;
    }

    &.red {
      color: ${({ colors }) => colors.red};
    }
  }
`;

const EllipsisBody = styled.div<TNavProp>`
  border-radius: 50%;
  cursor: url('${({ pointer }) => pointer}'), pointer;
  padding: 1px 13px 5px;
  position: relative;
  z-index: 10;

  &.disabled:hover {
    background-color: white;
  }

  &:hover {
    background-color: ${({ colors }) => colors.lighter_grey};
  }
`;
const Columns = styled.div<TNavProp>`
  margin: 12px;

  .column {
    margin: 12px;
    width: 280px;
    height: calc(100vh - 200px);

    &.add-col {
      border-radius: 6px;
      background-color: ${({ colors }) => colors.lighter_grey};
      height: calc(100% - 62px);
      margin-top: 50px;

      &:hover {
        cursor: url('${({ pointer }) => pointer}'), pointer;
        h1 {
          color: ${({ colors }) => colors.main_purple};
        }
      }

      h1 {
        color: ${({ colors }) => colors.medium_grey};
      }
    }

    h4 {
      text-transform: uppercase;
      margin-bottom: 24px;
      color: ${({ colors }) => colors.medium_grey};

      .circle {
        display: inline-block;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        margin-right: 12px;
      }

      .c0 {
        background-color: #8471f2;
      }

      .c1 {
        background-color: #67e2ae;
      }

      .c2 {
        background-color: #49c4e5;
      }

      .c3 {
        background-color: #5f49e5;
      }

      .c4 {
        background-color: #5fe549;
      }

      .c5 {
        background-color: #e5496e;
      }
    }
  }
`;

const Task = styled.button<TNavProp>`
  background-color: white;
  border-radius: 8px;
  padding: 23px 16px;
  margin-bottom: 20px;
  box-shadow: 0px 4px 6px 0px rgba(54, 78, 126, 0.1015);
  border: none;

  &:hover,
  &:focus-visible,
  &:active,
  &:focus {
    background-color: white;
    cursor: url('${({ pointer }) => pointer}'), pointer;
    border: none;
    outline: none;
    box-shadow: none;

    h3 {
      color: ${({ colors }) => colors.main_purple};
    }
  }

  h3 {
    text-align: left;
  }

  p {
    color: ${({ colors }) => colors.medium_grey};
    text-align: left;
    margin-bottom: 0px;
  }
`;

const Nav = styled.div<TColorProp & TPointerProp>`
  .logo {
    padding: 35px 24px;
    border: 1px solid ${({ colors }) => colors.lines_light};
    border-top: 0px;
    width: 300px;
    cursor: url('${({ pointer }) => pointer}'), pointer;
  }

  .navbar {
    padding: 29px 32px 37px;
    border-bottom: 1px solid ${({ colors }) => colors.lines_light};
    border-top: 0px;
    width: calc(100vw - 305px);

    @media (max-width: 575px) {
      width: 100vw;
      padding: 16px 3px 16px 16px;
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

const Main = styled.div`
  height: calc(100vh - 116px);
`;

const Content = styled.div<TNavProp>`
  background-color: ${({ colors }) => colors.light_grey};
  height: calc(100vh - 116px);
  width: calc(100vw - 305px);
  overflow-y: hidden;

  @media (max-width: 575px) {
    width: 100vw;

    h2 {
      margin: 0px 16px;
    }
  }

  &.collapsed {
    width: 100vw;
  }

  h2 {
    color: ${({ colors }) => colors.medium_grey};
    text-align: center;
    padding-bottom: 32px;
  }

  .content {
    height: inherit;
  }
`;
