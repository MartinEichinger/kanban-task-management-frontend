import * as React from 'react';
import styled from '@emotion/styled';
import { useAppSelector } from './store/hooks';
import Modal from 'react-bootstrap/Modal';
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
  const darkModus = useAppSelector((state) => state.darkModus.darkModus);

  return (
    <DeleteModalMain
      colors={props.colors}
      darkModus={darkModus}
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
                props.onDelete({ operation: 'board/deleteBoard', selectedBoard });
              } else {
                props.onDelete({
                  operation: 'tasks/deleteTask',
                  selectedBoard,
                  selectedCol,
                  selectedTask,
                });
              }
            }}
          >
            Delete
          </button>
          <button
            className={darkModus ? 'btn small second dark-modus w-100' : 'btn small second w-100'}
            onClick={props.onHide}
          >
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
  darkModus?: any;
};

type TPointerProp = {
  pointer: any;
};

const DeleteModalMain = styled(Modal)<TNavProp & TPointerProp>`
  .modal-content {
    border: 0px;
  }

  .modal-header {
    background-color: ${({ colors, darkModus }) => (darkModus ? colors.dark_grey : colors.white)};
  }

  .modal-body {
    background-color: ${({ colors, darkModus }) => (darkModus ? colors.dark_grey : colors.white)};
    border-bottom-left-radius: var(--bs-modal-inner-border-radius);
    border-bottom-right-radius: var(--bs-modal-inner-border-radius);
  }

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
