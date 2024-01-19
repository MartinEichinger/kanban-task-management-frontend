import * as React from 'react';
import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import Modal from 'react-bootstrap/Modal';
import Textfield from '../Textfield';
import Textarea from '../Textarea';
import Multitaskfield from '../Multitaskfield';
import Dropdown from '../Dropdown';
import { useThemeContext } from '../ThemeProvider/ThemeProvider';
import { useSelectStatus } from '../SelectStatusProvider/SelectStatusProvider';
import { IDatabaseBoard } from '../store/taskSlices';

interface TModalProp {
  show: any;
  onHide: any;
  changeData: any;
  boards: IDatabaseBoard[];
}

const NewBoardModal: React.FC<TModalProp> = (props) => {
  // RETRIEVE DATA / THEME / SELECT STATUS / INTERNAL STATE
  const { colors, theme } = useThemeContext();
  const { editedBoard } = useSelectStatus();
  const boardEdited = editedBoard > -1;
  const [title, setTitle] = useState('');
  const [columns, setColumns] = useState([{ id: '', name: '' }]);

  const debug = 0;

  var cols = props.boards?.[editedBoard]?.columns.map((col: any) => {
    return { id: col.id, name: col.name };
  });

  useEffect(() => {
    if (boardEdited) {
      setTitle(props.boards[editedBoard].name);
      setColumns(cols);
    } else {
      setTitle('');
    }
  }, [editedBoard]);

  const AddNewBoard = () => {
    //Validation

    // Return value
    props.changeData({ title, columns, edit: editedBoard });
    ResetData();
  };

  const ResetData = () => {
    setTitle('');
    setColumns([{ id: '', name: '' }]);
  };

  if (debug >= 2) console.log('NewBoardModal/beforeRender: ');

  return (
    <BoardModalMain
      colors={colors}
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className={theme.themeBg}>
        <Modal.Title id="contained-modal-title-vcenter" className={theme.themeTypoDark}>
          <h2>{boardEdited ? 'Edit Board' : 'Add New Board'}</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={theme.themeBg}>
        <>
          <TextfieldNTM
            colors={colors}
            title={boardEdited ? 'Board Name' : 'Name'}
            placeholder="e.g. Web Design"
            value={title}
            onChange={setTitle}
          />

          <MultitaskfieldNTM
            colors={colors}
            title={boardEdited ? 'Board Columns' : 'Columns'}
            placeholder={[
              'e.g. Todo',
              'e.g. Tolet',
              'e.g. Tobe',
              'e.g. Now',
              'e.g. Next',
              'e.g. Never',
              'e.g. Forget',
              'e.g. Doing',
              'e.g. Boing',
              'e.g. Clonck',
            ]}
            values={columns}
            onChange={setColumns}
          />

          <button className="small prim w-100" onClick={AddNewBoard}>
            {boardEdited ? 'Save Changes' : 'Create New Board'}
          </button>
        </>
      </Modal.Body>
    </BoardModalMain>
  );
};

export default NewBoardModal;

type TNavProp = {
  colors: any;
};

const TextfieldNTM = styled(Textfield)`
  margin-bottom: 24px;
`;

const MultitaskfieldNTM = styled(Multitaskfield)`
  margin-bottom: 24px;
`;

const BoardModalMain = styled(Modal)<TNavProp>`
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
