import * as React from 'react';
import styled from '@emotion/styled';
import { useAppSelector } from '../store/hooks';
import Modal from 'react-bootstrap/Modal';
import pointer from '../images/pointer.png';
import { useThemeContext } from '../ThemeProvider/ThemeProvider';
import { useSelectStatus } from '../SelectStatusProvider/SelectStatusProvider';

interface TSelectionProp {
  selectedBoard: number;
  selectedCol: number;
  selectedTask: number;
}

interface TModalProp {
  show: any;
  onHide: any;
  title: string;
  onDelete: any;
  target: string;
}

const DeleteModal: React.FC<TModalProp> = (props) => {
  // RETRIEVE DATA / THEME / SELECT STATUS / INTERNAL STATE
  const { colors, theme } = useThemeContext();
  const { selectedBoard, selectedCol, selectedTask } = useSelectStatus();
  const debug = 0;

  return (
    <DeleteModalMain
      colors={colors}
      pointer={pointer}
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className={theme.themeBg}>
        <Modal.Title id="contained-modal-title-vcenter">
          <h2 className="red">Delete this task?</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={theme.themeBg}>
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
            className={1 ? 'btn small second dark-modus w-100' : 'btn small second w-100'}
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
};

type TPointerProp = {
  pointer: any;
};

const DeleteModalMain = styled(Modal)<TNavProp & TPointerProp>`
  .modal-content {
    border: 0px;
  }

  .modal-body {
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
