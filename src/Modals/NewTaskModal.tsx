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

interface TModalProp {
  show: any;
  onHide: any;
  changeData: any;
  entriesSelect: any;
  boards: IDatabaseBoard[];
}

const NewTaskModal: React.FC<TModalProp> = (props) => {
  // RETRIEVE DATA / THEME / SELECT STATUS / INTERNAL STATE
  const { colors, theme } = useThemeContext();
  const { selectedBoard, selectedCol, editedTask } = useSelectStatus();
  const taskEdited = editedTask > -1;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subtasks, setSubtasks] = useState([{ id: '', title: '', isCompleted: 0 }]);
  const [status, setStatus] = useState({ id: props.entriesSelect[0], name: props.entriesSelect[0] }); // number of entriesSelect
  const debug = 0;

  // SUBTASK ENTRIES
  var subtasksEntries = props.boards?.[selectedBoard]?.columns[selectedCol]?.tasks[
    editedTask
  ]?.subtasks.map((task: any) => {
    return { id: task.id, title: task.title, isCompleted: task.isCompleted };
  });

  useEffect(() => {
    if (editedTask > -1) {
      setTitle(props.boards[selectedBoard].columns[selectedCol].tasks[editedTask].title);
      setDescription(props.boards[selectedBoard].columns[selectedCol].tasks[editedTask].description);
      setSubtasks(subtasksEntries);
      setStatus({
        id: props.entriesSelect[selectedCol]?.id,
        name: props.boards[selectedBoard].columns[selectedCol].name,
      });
    } else {
      setTitle('');
      setStatus({ id: props.entriesSelect[0]?.id, name: props.entriesSelect[0]?.name });
    }
  }, [selectedBoard, selectedCol, editedTask]); //, props.entriesSelect]);

  const AddNewTask = () => {
    //Validation
    console.log('NewTaskModal/AddNewTask: ', status);
    // Return value
    props.changeData({
      task: {
        id: null,
        title,
        description,
        status,
        subtasks,
      },
      stateAccess: {
        selectedBoard: selectedBoard,
        selectedCol: selectedCol,
        selectedTask: editedTask,
        selectedSubtask: null,
      },
    });
    ResetData();
  };

  const ChangeTask = () => {
    //Validation
    console.log('NewTAskModal/ChangeTask: ', title, description, subtasks, status);
    // Return value
    props.changeData({
      task: {
        id: null,
        title,
        description,
        status,
        subtasks,
      },
      stateAccess: {
        selectedBoard: selectedBoard,
        selectedCol: selectedCol,
        selectedTask: editedTask,
        selectedSubtask: null,
      },
    });
    ResetData();
  };

  const ResetData = () => {
    setTitle('');
    setDescription('');
    setSubtasks([{ id: '', title: '', isCompleted: 0 }]);
    setStatus(props.entriesSelect[0]?.name);
  };

  if (debug > 0) console.log('NewTaskModal/render: ', props.entriesSelect, status, subtasks);
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
          <h2>{taskEdited ? 'Edit Task' : 'Add New Task'}</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={theme.themeBg}>
        <>
          <TextfieldNTM
            colors={colors}
            title="Title"
            placeholder="e.g. Take coffee break"
            value={title}
            onChange={setTitle}
          />
          <TextareaNTM
            colors={colors}
            title="Description"
            placeholder="e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little."
            value={description}
            onChange={setDescription}
          />
          <MultitaskfieldNTM
            colors={colors}
            title="Subtasks"
            placeholder={[
              'e.g. Take coffee break',
              'e.g. Take tea break',
              'e.g. Take schnitzel break',
              'e.g. Take leberkäs break',
              'e.g. Take cigarette break',
              'e.g. Take water break',
              'e.g. Take silly break',
              'e.g. Take funny break',
              'e.g. Take serious break',
              'e.g. Take work break',
            ]}
            values={subtasks.map((entry) => {
              return { id: entry.id, name: entry.title };
            })}
            onChange={(val: any) => {
              console.log('NewTAskModal/Multitaskfield: ', val);
              setSubtasks(
                val.map((entry: any) => {
                  return { id: entry.id, title: entry.name, isCompleted: 0 };
                })
              );
            }}
          />

          <DropdownNTM
            title="Status"
            text={status.name}
            entries={props.entriesSelect}
            changeDropdown={(val) =>
              setStatus({ id: props.entriesSelect[val].id, name: props.entriesSelect[val].name })
            }
          />
          <button className="small prim w-100" onClick={editedTask > -1 ? ChangeTask : AddNewTask}>
            {editedTask > -1 ? 'Save Changes' : 'Create Task'}
          </button>
        </>
      </Modal.Body>
    </TaskModalMain>
  );
};

export default NewTaskModal;

type TNavProp = {
  colors: any;
  darkModus?: any;
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

const TaskModalMain = styled(Modal)<TNavProp>`
  .modal-content {
    border: 0px;
    outline: 0px;
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
