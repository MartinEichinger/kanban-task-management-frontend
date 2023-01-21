import * as React from 'react';
import { useState } from 'react';
import styled from '@emotion/styled';
import produce from 'immer';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Checkbox from './Checkbox';
import Dropdown from './Dropdown';
import { ReactComponent as Ellipsis } from './images/icon-vertical-ellipsis.svg';
import pointer from './images/pointer.png';

import { updateTask } from './store/taskSlices';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { useThemeContext } from './ThemeProvider/ThemeProvider';

interface TDataProp {
  boards: {
    name: string;
    columns?: {
      name: string;
      tasks: TTaskProp[];
    }[];
  }[];
}

interface TTaskProp {
  title: string;
  description: string;
  status: string;
  subtasks: {
    title: string;
    isCompleted: boolean;
  }[];
}

interface TSelectionProp {
  selectedBoard: number;
  selectedCol: number;
  selectedTask: number;
}

interface TModalProp {
  colors: any;
  show: any;
  onHide: any;
  boards: TDataProp;
  selection: TSelectionProp;
  handleMenuSelection: any;
  changeData: any;
}

const TaskModal: React.FC<TModalProp> = (props) => {
  var { selectedBoard, selectedCol, selectedTask } = props.selection;
  var board = selectedBoard > -1 ? (props as any).boards?.[selectedBoard] : undefined;
  var col = selectedBoard > -1 && selectedCol > -1 ? board?.columns?.[selectedCol] : undefined;
  var task =
    selectedBoard > -1 && selectedCol > -1 && selectedTask > -1 ? col?.tasks?.[selectedTask] : undefined;

  const debug = 0;
  const dispatch = useAppDispatch();

  const [showMenu, setShowMenu] = useState(false);
  const theme = useThemeContext();

  if (debug >= 1) console.log('CustomModal ', props, selectedBoard, selectedCol, selectedTask);
  if (debug >= 2 && selectedBoard > -1 && selectedCol > -1 && selectedTask > -1) {
    console.log('CustomModal/Board ', selectedBoard);
    console.log('CustomModal/Col: ', selectedCol);
    console.log('CustomModal/Task: ', selectedTask);
  }

  const onClickMenu = (sel: string) => {
    setShowMenu(false);
    if (sel === 'edit') {
      props.handleMenuSelection('edit', selectedBoard, selectedCol, selectedTask);
    } else {
      props.handleMenuSelection('delete', selectedBoard, selectedCol, selectedTask);
    }
  };

  if (debug > 0) console.log('TaskModal/beforeRender: ', board, props, task);
  return (
    <TaskModalMain
      colors={props.colors}
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className={theme.theme.themeBg}>
        <Modal.Title id="contained-modal-title-vcenter" className={theme.theme.themeTypoDark}>
          <h2>{selectedBoard > -1 && selectedCol > -1 && selectedTask > -1 && `${task?.title}`}</h2>
        </Modal.Title>
        <EllipsisBody
          className={theme.theme.themeHoverDark}
          pointer={pointer}
          colors={props.colors}
          onClick={() => setShowMenu(!showMenu)}
        >
          <Ellipsis />
        </EllipsisBody>
      </Modal.Header>
      <ModalMenu
        className={theme.theme.themeBgDark + ' ' + theme.theme.themePHoverDark}
        colors={props.colors}
        pointer={pointer}
        showMenu={showMenu}
      >
        <p onClick={() => onClickMenu('edit')}>Edit Task</p>
        <p className="red" onClick={() => onClickMenu('delete')}>
          Delete Task
        </p>
      </ModalMenu>
      <Modal.Body className={theme.theme.themeBg}>
        <>
          <p>{task?.description}</p>
          <p className="bold">Subtasks({task?.subtasks.length})</p>
          <div className="subtasks">
            {task?.subtasks.map((subtask: any, i: any) => {
              return (
                <div className="subtask" key={i}>
                  <Checkbox
                    colors={props.colors}
                    text={subtask.title}
                    checked={subtask.isCompleted}
                    onChange={(val: any) => {
                      var newTask: any = produce(task, (draftTask: any) => {
                        draftTask.subtasks[i].isCompleted = val === false ? 0 : 1;
                      });
                      dispatch(
                        updateTask({
                          stateAccess: {
                            selectedBoard,
                            selectedCol,
                            selectedTask,
                            selectedSubtask: i,
                          },
                          task: {
                            id: -1,
                            title: newTask.title,
                            description: newTask.description,
                            status: newTask.status,
                            subtasks: newTask.subtasks,
                          },
                        })
                      );
                    }}
                  />
                </div>
              );
            })}
          </div>
          <Dropdown
            colors={props.colors}
            title="Current Status"
            text={task?.status.name}
            entries={board?.columns}
            changeDropdown={(val: string) => {
              props.changeData({
                stateAccess: {
                  selectedBoard,
                  selectedCol,
                  selectedTask,
                  selectedSubtask: -1,
                },
                task: {
                  id: task.id,
                  title: task.title,
                  description: task.description,
                  status: { id: board.columns[val].id, name: board.columns[val].name },
                  subtasks: task.subtasks,
                },
              });
            }}
          />
        </>
      </Modal.Body>
    </TaskModalMain>
  );
};

export default TaskModal;

type TNavProp = {
  colors: any;
  darkModus?: any;
};

type TShowProp = {
  showMenu: any;
};

type TPointerProp = {
  pointer: any;
};

type TCombiProp = TNavProp & TPointerProp & TShowProp;

const ModalMenu = styled.div<TCombiProp>`
  display: ${({ showMenu }) => (showMenu ? 'block' : 'none')};
  border: 1px solid grey;
  position: absolute;
  z-index: 10;
  right: 32px;
  top: 64px;
  padding: 0px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px 0px rgba(54, 78, 126, 0.1015);
  //background-color: white;

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
      //background-color: ${({ colors }) => colors.light_grey};
      cursor: url('${({ pointer }) => pointer}'), pointer;
    }

    &.red {
      color: ${({ colors }) => colors.red};
    }
  }
`;

const EllipsisBody = styled.div<TNavProp & TPointerProp>`
  border-radius: 50%;
  cursor: url('${({ pointer }) => pointer}'), pointer;
  padding: 1px 13px 5px;
  position: relative;
  z-index: 10;
`;

const TaskModalMain = styled(Modal)<TNavProp>`
  .modal-content {
    border: 0px;
  }

  .modal-body {
    border-bottom-left-radius: var(--bs-modal-inner-border-radius);
    border-bottom-right-radius: var(--bs-modal-inner-border-radius);

    .bold {
      //color: ${({ colors, darkModus }) => (darkModus ? colors.white : colors.medium_grey)};
    }
  }

  p {
    color: ${({ colors }) => colors.medium_grey};
  }

  .subtasks {
    margin-bottom: 16px;
  }

  .subtask {
    margin-bottom: 8px;
  }
`;
