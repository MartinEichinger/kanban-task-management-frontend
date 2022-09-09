import * as React from 'react';
import { useState } from 'react';
import styled from '@emotion/styled';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
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
  colors: any;
  show: any;
  onHide: any;
  selection: TSelectionProp;
  title: string;
  onDelete: any;
  target: string;
}

const DeleteModal: React.FC<TModalProp> = (props) => {
  const debug = 0;

  var { selectedBoard, selectedCol, selectedTask } = props.selection;

  return (
    <DeleteModalMain
      colors={props.colors}
      pointer={pointer}
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          <h2 className="red">Delete this task?</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Are you sure you want to delete the ‘{props.title}’ {props.target} and its{' '}
          {props.target === 'task' ? 'sub' : ''}tasks? This action cannot be reversed.
        </p>
        <div className="d-flex flex-column flex-sm-row justify-content-start">
          <button
            className="btn small destruct mr-2 mb-2 w-100"
            onClick={() => {
              if (props.target === 'board') {
                props.onDelete('delete-board', selectedBoard);
              } else {
                props.onDelete('delete-task', selectedBoard, selectedCol, selectedTask);
              }
            }}
          >
            Delete
          </button>
          <button className="btn small second w-100" onClick={props.onHide}>
            Cancel
          </button>
        </div>
      </Modal.Body>
    </DeleteModalMain>
  );
};

export default DeleteModal;

type TNavProp = {
  colors: any;
};

type TPointerProp = {
  pointer: any;
};

const DeleteModalMain = styled(Modal)<TNavProp & TPointerProp>`
  .red {
    color: ${({ colors }) => colors.red};
  }

  p {
    color: ${({ colors }) => colors.medium_grey};
  }

  button {
    margin-right: 16px;
  }
`;
