import * as React from 'react';
import styled from '@emotion/styled';
import { useState, useEffect } from 'react';
import { useAppSelector } from './store/hooks';
import Textfield from './Textfield';
import { ReactComponent as Cross } from './icon-cross.svg';

interface IMultitaskfield {
  className?: string;
  colors: any;
  title: string;
  placeholder?: string[];
  values: {
    id: string;
    name: string;
  }[];
  onChange?: any;
}

const Multitaskfield: React.FC<IMultitaskfield> = ({
  className,
  colors,
  title,
  placeholder,
  values,
  onChange,
}) => {
  const debug = 0;

  if (debug >= 1) console.log('Multitaskfield: ', title, placeholder, values);
  const placeholderList = placeholder;
  const [taskList, setTaskList] = useState(values);
  const darkModus = useAppSelector((state) => state.darkModus.darkModus);

  useEffect(() => {
    if (debug >= 2) console.log('Multitaskfield/useEffect: ', values);
    if (values !== undefined) {
      setTaskList(values);
    } else {
      setTaskList([
        { id: '', name: '' },
        { id: '', name: '' },
      ]);
    }
  }, [values]);

  const AddRemoveSubTask = (idx: any) => {
    if (debug >= 2) console.log('Multitaskfield/AddRemoveSubTask: ', idx);
    var list = taskList;

    if (idx > -1) {
      list.splice(idx, 1);
      setTaskList([...list]);
    } else {
      list.push({ id: '', name: '' });
      setTaskList([...list]);
    }

    onChange(list);
  };

  const ChangeSubtask = (id: string, text: string, idx: number) => {
    if (debug >= 2) console.log('MultitaskField/ChangeSubtask: ', id, text, idx);
    var list = taskList;
    list[idx] = { id: id, name: text };
    setTaskList([...list]);
    onChange(list);
  };

  if (debug >= 1) console.log('Multitaskfield/beforeRender: ', taskList);
  return (
    <MultitaskfieldMain colors={colors} darkModus={darkModus} className={className}>
      <label htmlFor="Textarea">{title}</label>

      {taskList.map((item, i) => {
        return (
          <div className="selectfield d-flex flex-row justify-content-center align-items-center" key={i}>
            <Textfield
              colors={colors}
              placeholder={placeholderList?.[i % 10]}
              value={taskList[i].name}
              onChange={(text: string) => ChangeSubtask(taskList[i].id, text, i)}
            />
            <CrossMTF onClick={() => AddRemoveSubTask(i)} />
          </div>
        );
      })}
      <button
        className={darkModus ? 'small second dark-modus w-100' : 'small second w-100'}
        onClick={() => AddRemoveSubTask(-1)}
      >
        + Add New {title.slice(0, -1)}
      </button>
    </MultitaskfieldMain>
  );
};

export default Multitaskfield;

type TNavProp = {
  colors: any;
  darkModus?: any;
};

const CrossMTF = styled(Cross)`
  margin-left: 16px;
  cursor: pointer;
`;

const MultitaskfieldMain = styled.div<TNavProp>`
  label {
    font-size: 12px;
    font-weight: 700;
    line-height: 15px;
    color: ${({ colors, darkModus }) => (darkModus ? colors.white : colors.medium_grey)};
    margin-bottom: 8px;
  }

  .selectfield {
    width: 100%;
    margin-bottom: 12px;
  }
`;
