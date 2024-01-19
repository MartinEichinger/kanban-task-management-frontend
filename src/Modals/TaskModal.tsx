import * as React from 'react';
import { useState } from 'react';
import styled from '@emotion/styled';
import produce from 'immer';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Checkbox from '../Checkbox';
import Dropdown from '../Dropdown';
import { ReactComponent as Ellipsis } from '../images/icon-vertical-ellipsis.svg';
import pointer from '../images/pointer.png';

import { updateTask, IDatabaseBoard } from '../store/taskSlices';
import { useAppDispatch } from '../store/hooks';
import { useThemeContext } from '../ThemeProvider/ThemeProvider';
import { useSelectStatus } from '../SelectStatusProvider/SelectStatusProvider';

interface TModalProp {
  show: any;
  onHide: any;
  boards: IDatabaseBoard[];
  handleMenuSelection: any;
  changeData: any;
}

const TaskModal: React.FC<TModalProp> = (props) => {
  // RETRIEVE DATA
  const { colors, theme } = useThemeContext();
  const { selectedBoard, selectedCol, selectedTask } = useSelectStatus();
  const boardSelected = selectedBoard > -1;
  const colSelected = selectedCol > -1;
  const taskSelected = selectedTask > -1;
  console.log(boardSelected, colSelected, taskSelected);

  const board = boardSelected ? props.boards?.[selectedBoard] : undefined;
  const col = boardSelected && colSelected ? board?.columns?.[selectedCol] : undefined;
  const task = boardSelected && colSelected && taskSelected ? col?.tasks?.[selectedTask] : undefined;
  console.log(board, col, task);

  const debug = 2;
  const dispatch = useAppDispatch();
  const [showMenu, setShowMenu] = useState(false);

  // METHODS
  const onClickMenu = (sel: string) => {
    setShowMenu(false);
    if (sel === 'edit') {
      props.handleMenuSelection('edit', selectedBoard, selectedCol, selectedTask);
    } else {
      props.handleMenuSelection('delete', selectedBoard, selectedCol, selectedTask);
    }
  };

  if (debug > 0)
    console.log(
      'TaskModal/beforeRender: ',
      props,
      board,
      col,
      task,
      selectedBoard,
      selectedCol,
      selectedTask,
      boardSelected,
      colSelected,
      taskSelected
    );
  return (
    <TaskModalMain
      colors={colors}
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className={theme.themeBg}>
        <Modal.Title id="contained-modal-title-vcenter" className={theme.themeTypoDark}>
          <h2>{selectedBoard > -1 && selectedCol > -1 && selectedTask > -1 && `${task?.title}`}</h2>
        </Modal.Title>
        <EllipsisBody
          className={theme.themeHoverDark}
          pointer={pointer}
          colors={colors}
          onClick={() => setShowMenu(!showMenu)}
        >
          <Ellipsis />
        </EllipsisBody>
      </Modal.Header>
      <ModalMenu
        className={theme.themeBgDark + ' ' + theme.themePHoverDark}
        colors={colors}
        pointer={pointer}
        showMenu={showMenu}
      >
        <p onClick={() => onClickMenu('edit')}>Edit Task</p>
        <p className="red" onClick={() => onClickMenu('delete')}>
          Delete Task
        </p>
      </ModalMenu>
      <Modal.Body className={theme.themeBg}>
        <>
          <p>{task?.description}</p>
          <p className="bold">Subtasks({task?.subtasks.length})</p>
          <div className="subtasks">
            {task?.subtasks.map((subtask: any, i: any) => {
              return (
                <div className="subtask" key={i}>
                  <Checkbox
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
                  id: task?.id,
                  title: task?.title,
                  description: task?.description,
                  status: { id: board?.columns[val as any].id, name: board?.columns[val as any].name },
                  subtasks: task?.subtasks,
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
