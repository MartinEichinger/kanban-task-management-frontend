import * as React from 'react';
import { useState, useEffect } from 'react';
import { useAppSelector } from './store/hooks';
import styled from '@emotion/styled';
import Modal from 'react-bootstrap/Modal';
import Textfield from './Textfield';
import Textarea from './Textarea';
import Multitaskfield from './Multitaskfield';
import Dropdown from './Dropdown';

interface TModalProp {
  colors: any;
  show: any;
  onHide: any;
  changeData: any;
  edit: number;
  data: any;
}

const NewBoardModal: React.FC<TModalProp> = (props) => {
  const [title, setTitle] = useState('');
  const [columns, setColumns] = useState([{ id: '', name: '' }]);
  const darkModus = useAppSelector((state) => state.darkModus.darkModus);

  const debug = 0;

  var cols = props.data.boards?.[props.edit]?.columns.map((col: any) => {
    return { id: col.id, name: col.name };
  });
  if (debug >= 2) console.log('NewBoardModal: ', cols);
  if (debug >= 2) console.log('NewBoardModal: ', props.edit, props.data.boards?.[props.edit]?.name);

  useEffect(() => {
    if (debug >= 2) console.log('NewBoardModal/useEffect: ', props.edit);
    if (props.edit > -1) {
      setTitle(props.data.boards[props.edit].name);
      setColumns(cols);
    } else {
      setTitle('');
    }
  }, [props.edit]);

  const AddNewBoard = () => {
    //Validation

    // Return value
    props.changeData({ title, columns, edit: props.edit });
    ResetData();
  };

  const ResetData = () => {
    setTitle('');
    setColumns([{ id: '', name: '' }]);
  };

  if (debug >= 2) console.log('NewBoardModal/beforeRender: ');

  return (
    <BoardModalMain
      colors={props.colors}
      darkModus={darkModus}
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          <h2>{props.edit > -1 ? 'Edit Board' : 'Add New Board'}</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <>
          <TextfieldNTM
            colors={props.colors}
            title={props.edit > -1 ? 'Board Name' : 'Name'}
            placeholder="e.g. Web Design"
            value={title}
            onChange={setTitle}
          />

          <MultitaskfieldNTM
            colors={props.colors}
            title={props.edit > -1 ? 'Board Columns' : 'Columns'}
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
            {props.edit > -1 ? 'Save Changes' : 'Create New Board'}
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

const DropdownNTM = styled(Dropdown)`
  margin-bottom: 24px;
`;

const TextfieldNTM = styled(Textfield)`
  margin-bottom: 24px;
`;

const TextareaNTM = styled(Textarea)`
  margin-bottom: 24px;
`;

const MultitaskfieldNTM = styled(Multitaskfield)`
  margin-bottom: 24px;
`;

const BoardModalMain = styled(Modal)<TNavProp>`
  .modal-content {
    border: 0px;
  }

  .modal-header {
    background-color: ${({ colors, darkModus }) => (darkModus ? colors.dark_grey : colors.white)};
    color: ${({ colors, darkModus }) => (darkModus ? colors.white : colors.black)};
  }

  .modal-body {
    background-color: ${({ colors, darkModus }) => (darkModus ? colors.dark_grey : colors.white)};
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
