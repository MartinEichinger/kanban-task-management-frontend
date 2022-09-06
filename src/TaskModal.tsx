import * as React from 'react';
import { useState } from 'react';
import styled from '@emotion/styled';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Checkbox from './Checkbox';
import Dropdown from './Dropdown';
import { ReactComponent as Ellipsis } from './images/icon-vertical-ellipsis.svg';
import pointer from './images/pointer.png';

interface TDataProp {
  boards: {
    name: string;
    columns?: {
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
  changeData: any;
  handleMenuSelection: any;
}

const TaskModal: React.FC<TModalProp> = (props) => {
  var { selectedBoard, selectedCol, selectedTask } = props.selection;
  var board = selectedBoard > -1 ? props.boards.boards?.[selectedBoard] : undefined;
  var col = selectedBoard > -1 && selectedCol > -1 ? board?.columns?.[selectedCol] : undefined;
  var task =
    selectedBoard > -1 && selectedCol > -1 && selectedTask > -1 ? col?.tasks?.[selectedTask] : undefined;

  const debug = 0;

  const [showMenu, setShowMenu] = useState(false);

  if (debug >= 1) console.log('CustomModal ', props, selectedBoard, selectedCol, selectedTask);
  if (debug >= 2 && selectedBoard > -1 && selectedCol > -1 && selectedTask > -1) {
    console.log('CustomModal/Board ', selectedBoard);
    console.log('CustomModal/Col: ', selectedCol);
    console.log('CustomModal/Task: ', selectedTask);
  }

  const changeFormfield = (type: string, val: boolean | string, selectedSubtask?: number) => {
    console.log('Change formfield: ', type, val, selectedSubtask);
    // Status of subtask or task
    props.changeData(type, selectedBoard, selectedCol, selectedTask, selectedSubtask, val);
  };

  const onClickMenu = (sel: string) => {
    setShowMenu(false);
    if (sel === 'edit') {
      props.handleMenuSelection('edit', selectedBoard, selectedCol, selectedTask);
    } else {
      props.handleMenuSelection('delete', selectedBoard, selectedCol, selectedTask);
    }
  };

  return (
    <TaskModalMain
      colors={props.colors}
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          <h2>{selectedBoard > -1 && selectedCol > -1 && selectedTask > -1 && `${task?.title}`}</h2>
        </Modal.Title>
        <EllipsisBody pointer={pointer} colors={props.colors} onClick={() => setShowMenu(!showMenu)}>
          <Ellipsis />
        </EllipsisBody>
      </Modal.Header>
      <ModalMenu colors={props.colors} pointer={pointer} showMenu={showMenu}>
        <p onClick={() => onClickMenu('edit')}>Edit Task</p>
        <p className="red" onClick={() => onClickMenu('delete')}>
          Delete Task
        </p>
      </ModalMenu>
      <Modal.Body>
        <>
          <p>{task?.description}</p>
          <p className="bold">Subtasks({task?.subtasks.length})</p>
          <div className="subtasks">
            {task?.subtasks.map((subtask, i) => {
              return (
                <div className="subtask" key={i}>
                  <Checkbox
                    colors={props.colors}
                    text={subtask.title}
                    checked={subtask.isCompleted}
                    onChange={(val: any) => changeFormfield('subtask', val, i)}
                  />
                </div>
              );
            })}
          </div>
          <Dropdown
            colors={props.colors}
            title="Current Status"
            text={task?.status}
            entries={board?.columns}
            changeDropdown={(val: string) => changeFormfield('task', val)}
          />
        </>
      </Modal.Body>
    </TaskModalMain>
  );
};

export default TaskModal;

type TNavProp = {
  colors: any;
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

const EllipsisBody = styled.div<TNavProp & TPointerProp>`
  border-radius: 50%;
  cursor: url('${({ pointer }) => pointer}'), pointer;
  padding: 1px 13px 5px;
  position: relative;
  z-index: 10;

  &:hover {
    background-color: ${({ colors }) => colors.lighter_grey};
  }
`;

const TaskModalMain = styled(Modal)<TNavProp>`
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
