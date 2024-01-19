import styled from '@emotion/styled';
import { useThemeContext } from '../ThemeProvider/ThemeProvider';
import { useAppSelector } from '../store/hooks';
import { useSelectStatus } from '../SelectStatusProvider/SelectStatusProvider';
import { useModalStatus } from '../ModalStatusProvider/ModalStatusProvider';
import pointer from '../images/pointer.png';

export const Content = () => {
  // RETRIEVE DATA / THEME / DATA / SELECT STATUS / MODAL STATUS
  const { theme, colors } = useThemeContext();
  const boards = useAppSelector((state) => state.taskData.boards);
  const { selectedBoard, setSelectedTask, setSelectedCol, setEditedBoard } = useSelectStatus();
  const boardSelected = selectedBoard > -1;

  const { setTaskModalShow, setNewBoardModalShow } = useModalStatus();

  // METHODS
  const selectTask = (col: number, task: number) => {
    setSelectedCol(col);
    setSelectedTask(task);
    setTaskModalShow(true);
  };

  const RenderMessage = () => {
    return (
      <>
        <h2>This board is empty. Create a new column to get started.</h2>
        <button className="btn large prim" disabled={!boardSelected}>
          + Add New Column
        </button>
      </>
    );
  };

  const RenderContent = () => {
    var obj = boards[selectedBoard];

    return (
      <Columns
        className="columns d-flex flex-row justify-content-start align-items-start"
        colors={colors}
        pointer={pointer}
      >
        {obj.columns?.map((item: any, i: any) => {
          return (
            <Column className="column d-flex flex-column" key={i}>
              <h4 className="d-flex flex-row align-items-center">
                <span className={'circle c' + i}></span>
                {item.name} ({item.tasks.length})
              </h4>
              <div className="col-body">
                {item.tasks.map((task: any, j: any) => {
                  var completed = task.subtasks.filter((subtask: any) => {
                    return subtask.isCompleted === 1;
                  });
                  return (
                    <Task
                      type="button"
                      className={
                        'task ' + theme.themeBg + ' ' + theme.themeHover + ' ' + theme.themeTypoDark
                      }
                      onClick={() => selectTask(i, j)}
                      key={j}
                      pointer={pointer}
                      colors={colors}
                    >
                      <h3>{task.title}</h3>
                      <p className="bold">
                        {completed.length} of {task.subtasks.length} subtasks
                      </p>
                    </Task>
                  );
                })}
              </div>
            </Column>
          );
        })}
        <NewColButton
          className={
            'column add-col d-flex flex-column justify-content-center align-items-center ' +
            theme.themeBg2
          }
          onClick={() => {
            setEditedBoard(selectedBoard);
            setNewBoardModalShow(true);
          }}
        >
          <h1>+ New Column</h1>
        </NewColButton>
      </Columns>
    );
  };

  return (
    <ContentMain
      className={
        boardSelected
          ? 'content d-flex flex-column justify-content-start align-items-start ' + theme.themeBgDark2
          : 'content d-flex flex-column justify-content-center align-items-center ' + theme.themeBgDark2
      }
      colors={colors}
    >
      {boardSelected ? <RenderContent /> : <RenderMessage />}
    </ContentMain>
  );
};

type TColorProp = {
  colors: any;
};

type TPointerProp = {
  pointer: any;
};

const ContentMain = styled.div<TColorProp>`
  height: 100%;
  width: 100%;
  overflow-y: hidden;

  @media (max-width: 575px) {
    width: 100vw;
    height: calc(100vh - 67px);

    h2 {
      margin: 0px 16px;
    }
  }

  &.collapsed {
    width: 100vw;
  }

  h2 {
    color: ${({ colors }) => colors.medium_grey};
    text-align: center;
    padding-bottom: 32px;
  }

  .content {
    height: inherit;
  }
`;

const Columns = styled.div<TColorProp & TPointerProp>`
  margin: 12px;
  height: inherit;

  .column {
    margin: 12px;
    width: 280px;
    height: calc(100% - 15px); //calc(100vh - 200px);

    .col-body {
      overflow-x: hidden;
    }

    &.add-col {
      border-radius: 6px;
      height: calc(100% - 62px);
      margin-top: 50px;

      &:hover {
        cursor: url('${({ pointer }) => pointer}'), pointer;
        h1 {
          color: ${({ colors }) => colors.main_purple};
        }
      }

      h1 {
        color: ${({ colors }) => colors.medium_grey};
      }
    }

    h4 {
      text-transform: uppercase;
      margin-bottom: 24px;
      color: ${({ colors }) => colors.medium_grey};

      .circle {
        display: inline-block;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        margin-right: 12px;
      }

      .c0 {
        background-color: #8471f2;
      }

      .c1 {
        background-color: #67e2ae;
      }

      .c2 {
        background-color: #49c4e5;
      }

      .c3 {
        background-color: #5f49e5;
      }

      .c4 {
        background-color: #5fe549;
      }

      .c5 {
        background-color: #e5496e;
      }
    }
  }
`;

const Task = styled.button<TColorProp & TPointerProp>`
  border-radius: 8px;
  padding: 23px 16px;
  margin-bottom: 20px;
  box-shadow: 0px 4px 6px 0px rgba(54, 78, 126, 0.1015);
  border: none;

  &:hover,
  &:focus-visible,
  &:active,
  &:focus {
    cursor: url('${({ pointer }) => pointer}'), pointer;
    border: none;
    outline: none;
    box-shadow: none;

    h3 {
      color: ${({ colors }) => colors.main_purple};
    }
  }

  h3 {
    text-align: left;
    color: inherit;
  }

  p {
    color: ${({ colors }) => colors.medium_grey};
    text-align: left;
    margin-bottom: 0px;
  }
`;

const Column = styled.div``;
const NewColButton = styled.div``;
