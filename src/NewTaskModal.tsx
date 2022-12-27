import * as React from 'react';
import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import Modal from 'react-bootstrap/Modal';
import Textfield from './Textfield';
import Textarea from './Textarea';
import Multitaskfield from './Multitaskfield';
import Dropdown from './Dropdown';
import IDatabaseTask from './store/taskSlices';

interface TModalProp {
  colors: any;
  show: any;
  onHide: any;
  changeData: any;
  edit: number[];
  entriesSelect: any;
  data: any;
}

const NewTaskModal: React.FC<TModalProp> = (props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subtasks, setSubtasks] = useState([{ id: '', title: '', isCompleted: 0 }]);
  const [status, setStatus] = useState({ id: props.entriesSelect[0], name: props.entriesSelect[0] }); // number of entriesSelect

  const debug = 0;

  var subtasksEntries = props.data.boards?.[props.edit[0]]?.columns[props.edit[1]]?.tasks[
    props.edit[2]
  ]?.subtasks.map((task: any) => {
    return { id: task.id, title: task.title, isCompleted: task.isCompleted };
  });

  useEffect(() => {
    if (debug >= 2) console.log('NewTaskModal/useEffect: ', props.edit, props.entriesSelect, status);
    if (props.edit[2] > -1) {
      setTitle(props.data.boards[props.edit[0]].columns[props.edit[1]].tasks[props.edit[2]].title);
      setDescription(
        props.data.boards[props.edit[0]].columns[props.edit[1]].tasks[props.edit[2]].description
      );
      setSubtasks(subtasksEntries);
      setStatus({
        id: props.entriesSelect[props.edit[1]]?.id,
        name: props.data.boards[props.edit[0]].columns[props.edit[1]].name,
      });
    } else {
      setTitle('');
      setStatus({ id: props.entriesSelect[0]?.id, name: props.entriesSelect[0]?.name });
    }
  }, [props.edit]); //, props.entriesSelect]);

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
        selectedBoard: props.edit[0],
        selectedCol: props.edit[1],
        selectedTask: props.edit[2],
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
        selectedBoard: props.edit[0],
        selectedCol: props.edit[1],
        selectedTask: props.edit[2],
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
      colors={props.colors}
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          <h2>{props.edit[2] > -1 ? 'Edit Task' : 'Add New Task'}</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <>
          <TextfieldNTM
            colors={props.colors}
            title="Title"
            placeholder="e.g. Take coffee break"
            value={title}
            onChange={setTitle}
          />
          <TextareaNTM
            colors={props.colors}
            title="Description"
            placeholder="e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little."
            value={description}
            onChange={setDescription}
          />
          <MultitaskfieldNTM
            colors={props.colors}
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
            colors={props.colors}
            title="Status"
            text={status.name}
            entries={props.entriesSelect}
            changeDropdown={(val) =>
              setStatus({ id: props.entriesSelect[val].id, name: props.entriesSelect[val].name })
            }
          />
          <button className="small prim w-100" onClick={props.edit[2] > -1 ? ChangeTask : AddNewTask}>
            {props.edit[2] > -1 ? 'Save Changes' : 'Create Task'}
          </button>
        </>
      </Modal.Body>
    </TaskModalMain>
  );
};

export default NewTaskModal;

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
