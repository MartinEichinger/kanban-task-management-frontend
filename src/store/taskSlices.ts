import { createSlice, PayloadAction, current } from '@reduxjs/toolkit';
import { getData } from './api';
import { AppThunk } from './store';

const debug = 1;

// DATABASE
export interface IDatabaseBoard {
  id: number;
  name: string;
  columns: IDatabaseColumn[];
}

export interface IDatabaseColumn {
  id: number;
  name: string;
  tasks: IDatabaseTask[];
}

export interface IDatabaseTask {
  id: number;
  title: string;
  description: string;
  status: {
    id: number;
    name: string;
  };
  subtasks: IDatabaseSubtask[];
}

export interface IDatabaseSubtask {
  id: number;
  title: string;
  isCompleted: boolean;
}

// STATE
export interface IStateAccess {
  selectedBoard: number;
  selectedCol: number;
  selectedTask: number;
  selectedSubtask: number;
}

export interface IInitialState {
  loading: boolean;
  boards: IDatabaseBoard[];
}

// REDUCER
interface IPayloadType {
  type: string;
}

interface IPayloadBoards {
  type: string;
  boards: IDatabaseBoard[];
}

interface IPayloadTask {
  type: string;
  task: IDatabaseTask;
  stateAccess: IStateAccess;
}

interface IPayloadError {
  error: any;
}

// ACTIONS
export interface IUpdateTask {
  stateAccess: IStateAccess;
  task: IDatabaseTask;
}

/////////

type TPropCreateBoard = {
  id: string;
  name: string;
  columns: {
    id: string;
    name: string;
  }[];
};

type TPayloadDeleteTask = {
  type: string;
  props: any;
};

type TPayloadCreateBoard = {
  type: string;
  props: TPropCreateBoard;
};

type TPropDeleteBoard = {
  id: number;
  arrNo: number;
  val: any;
};

type TPayloadDeleteBoard = {
  type: string;
  props: TPropDeleteBoard;
};

// initial state
const initialState: IInitialState = {
  loading: false,
  boards: [] as never,
};

// create slice
export const slice = createSlice({
  name: 'taskData',
  initialState,
  reducers: {
    // onStart
    itemsRequested: (state, action: PayloadAction<IPayloadType>) => {
      if (debug > 0) console.log(action.payload.type);

      // start data update
      state.loading = true;
    },

    // onSuccess
    itemsReceived: (state, action: PayloadAction<IPayloadBoards>) => {
      if (debug > 0) console.log(action.payload.type, ': ', action.payload);

      // update state with new data
      var __boards = action.payload.boards;
      state.boards = __boards;

      // create status entries
      __boards.forEach((board, i) => {
        // loop over each board
        board.columns.map((column, j) => {
          // loop over each column
          var __id = column.id;
          var __name = column.name;
          return column.tasks.forEach((task, k) => {
            // loop over each column
            state.boards[i].columns[j].tasks[k].status = { id: __id, name: __name };
          });
        });
      });

      console.log('all: ', state.boards);

      // finalize data update
      state.loading = false;
    },

    taskCreated: (state, action: PayloadAction<IPayloadTask>) => {
      // destruct input data
      var { selectedBoard, selectedCol, selectedTask, selectedSubtask } = action.payload.stateAccess;
      var { id, title, description, status, subtasks } = action.payload.task;
      var type = action.payload.type;
      if (debug > 0) console.log(type, ': ', selectedBoard, selectedCol, selectedTask, selectedSubtask);
      if (debug > 0) console.log(type, ': ', id, title, description, status, subtasks);

      // define newTask object
      var newTask = {
        id: id,
        title: title,
        description: description,
        status: status,
        subtasks: subtasks.map((subtask: any, i: any) => {
          return {
            id: subtask.id,
            title: subtask.title,
            isCompleted: false,
          };
        }),
      };

      // update state with new task
      (state as any).boards[selectedBoard].columns.map((colName: any, i: any) => {
        if (colName.name === status.name) {
          return (state as any).boards[selectedBoard].columns[i].tasks.push(newTask);
        }
      });

      state.loading = false;
    },

    taskUpdated: (state, action: PayloadAction<IPayloadTask>) => {
      // destruct input data
      var { selectedBoard, selectedCol, selectedTask, selectedSubtask } = action.payload.stateAccess;
      var { id, title, description, status, subtasks } = action.payload.task;

      if (debug > 0)
        console.log('task/taskUpdated: ', selectedBoard, selectedCol, selectedTask, selectedSubtask);
      if (debug > 0) console.log('task/taskUpdated: ', id, title, description, status, subtasks);

      // update tasks data
      (state as any).boards[selectedBoard].columns[selectedCol].tasks[selectedTask] = {
        id: id,
        title: title,
        description: description,
        status: status,
        subtasks: subtasks,
      };

      // get task id
      //var id = (state as any).boards[selectedBoard].columns[selectedCol].tasks[selectedTask].id;
      // assign new status to selected task
      (state as any).boards[selectedBoard].columns[selectedCol].tasks[selectedTask].status = status;
      // copy selected task
      var cut = (state as any).boards[selectedBoard].columns[selectedCol].tasks[selectedTask];
      // delete selected task from column
      (state as any).boards[selectedBoard].columns[selectedCol].tasks.splice(selectedTask, 1);
      // push selected task to new column
      //(state as any).boards[selectedBoard].columns[col_id].tasks.push(cut);
      (state as any).boards[selectedBoard].columns.map((col: any, i: any) => {
        console.log('Col: ', col, i);
        if (col.name === status.name) {
          col.tasks.push(cut);
          // get col_id
          //col_id = (state as any).boards[selectedBoard].columns[i].id;
        }
      });
      // update db
      //console.log('updateDirectus: ', id, val.name);

      console.log(state.boards);
      //state.boards = el;

      state.loading = false;
    },

    taskDeleted: (state, action: PayloadAction<TPayloadDeleteTask>) => {
      // destruct input data
      var { selectedBoard, selectedCol, selectedTask } = action.payload.props.val;
      if (debug >= 1)
        console.log(
          'task/taskDeleted: ',
          selectedBoard,
          selectedCol,
          selectedTask,
          action.payload.props
        );

      // delete board
      (state as any).boards[selectedBoard].columns[selectedCol].tasks.splice(selectedTask, 1);

      state.loading = false;
    },

    boardCreated: (state, action: PayloadAction<TPayloadCreateBoard>) => {
      // destruct input data
      var { id: __id, name: __name, columns: __columns } = action.payload.props;
      if (debug >= 1) console.log('board/boardCreated: ', __id, __name, __columns);

      var newBoard = {
        id: __id,
        name: __name,
        columns: __columns.map((col: any, i: any) => {
          return {
            id: col.id,
            name: col.name,
            tasks: [],
          };
        }),
      };
      console.log('App/AddNewBoard/cols: ', newBoard);

      (state as any).boards.push(newBoard);

      state.loading = false;
    },

    boardUpdated: (state, action: PayloadAction<TPayloadCreateBoard>) => {
      // destruct input data
      var { id: __id, name: __name, columns: __columns } = action.payload.props;
      if (debug >= 1) console.log('board/boardUpdated: ', __id, __name, __columns);

      // find right board
      var __idx = (state as any).boards.findIndex((board: any) => board.id === __id);
      if (debug >= 1) console.log('board/boardUpdated: ', __idx);

      // update name
      (state as any).boards[__idx].name = __name;

      var coveredNew = new Array(__columns.length).fill(0); // new columns
      var coveredExisting = new Array((state as any).boards[__idx].columns.length).fill(0); // existing columns
      (state as any).boards[__idx].columns.map((col: any, i: any) => {
        // check if new columns are already existing
        __columns.map((newCol: any, j: any) => {
          // if yes, add updated name to existing column
          if (col.id === newCol.id) {
            (state as any).boards[__idx].columns[i].name = newCol.name;
            coveredExisting[i] = 1;
            coveredNew[j] = 1;
          }
          if (debug >= 1)
            console.log('board/boardUpdated: ', current(col), newCol, j, coveredNew, coveredExisting);
        });
      });

      // if existing col is no longer in new cols -> delete col entry in state
      (coveredExisting as any).map((exist: any, i: any) => {
        if (!exist) (state as any).boards[__idx].columns.splice(i, 1);
      });
      // add newly defined cols to state
      (coveredNew as any).map((exist: any, i: any) => {
        if (debug >= 1) console.log('board/boardUpdated: ', __columns[i]);
        if (!exist) (state as any).boards[__idx].columns.push({ ...__columns[i], tasks: [] });
      });

      state.loading = false;
    },

    boardDeleted: (state, action: PayloadAction<TPayloadDeleteBoard>) => {
      // destruct input data
      var { id: __id, arrNo: __arrNo } = action.payload.props;
      if (debug >= 1) console.log('board/boardDeleted: ', __id, __arrNo);

      // delete board
      (state as any).boards.splice(__arrNo, 1);

      state.loading = false;
    },

    // onError
    itemsRequestFailed: (state, action: PayloadAction<IPayloadError>) => {
      if (debug > 0) console.log('task/taksRequestFailed', action.payload?.error);
      state.loading = false;
    },
  },
});

// export reducer
export default slice.reducer;

// export actions
export const {
  itemsRequested,
  itemsReceived,
  taskUpdated,
  taskCreated,
  taskDeleted,
  boardCreated,
  boardUpdated,
  boardDeleted,
  itemsRequestFailed,
} = slice.actions;

// export action creators
export const getDatabaseEntries = (): AppThunk => async (dispatch) => {
  if (debug > 0) console.log('task/getTasks');

  // prepare action
  let actionType = 'taskData/itemsReceived';
  let queryScheme = `
  query {
    boards {
      id
      name
      columns {
        id
        name
        tasks {
          id
          title
          description
          subtasks {
            id
            title
            isCompleted
          }
        }
      }
    }
  }`;
  let queryType = 'item';

  // Dispatch Request
  dispatch(itemsRequested({ type: actionType }));

  // Perform Request
  let data = await getData(queryScheme, queryType); //searchUrl, headers, formData.method);
  console.log('taskSlices/getDBEntries: ', data);

  // send error due to failed get
  if (data.error) {
    dispatch(itemsRequestFailed({ error: data.error.errors[0].message }));
  } else {
    // Load data to store
    actionType = 'taskData/itemsRequested';
    dispatch(itemsReceived({ boards: (data as any).boards, type: actionType }));
  }
};

export const createTask =
  ({ task, stateAccess }: IUpdateTask): AppThunk =>
  async (dispatch) => {
    // destruct input data
    var { selectedBoard, selectedCol, selectedTask, selectedSubtask } = stateAccess;
    var { id, title, description, status, subtasks } = task;

    if (debug) console.log('taskData/createTask: ', task, stateAccess);

    var __actionType = 'taskData/itemsReceived';
    // Dispatch Request
    dispatch(itemsRequested({ type: __actionType }));

    // Prepare/Perform Mutation
    var queryScheme = `mutation {
      create_kanban_tasks_item(
        data: {
          column_id: {
            id: ${status.id} 
          },
          title: "${title}",
          description: "${description}",
          subtasks: [${subtasks.map((subtask: any, i: any) => {
            return `{title: "${subtask.title}", isCompleted: 0}`;
          })}
          ]
        }
      ) {
        id
        column_id {
          id
        }
        title
        description
        subtasks {
          id
          title
          isCompleted
        }
      }
    }`;
    var data = await getData(queryScheme, 'item');

    // send error due to failed get
    if (data.error) {
      dispatch(itemsRequestFailed({ error: data.error.errors[0].message }));
    } else {
      // Load data to store
      var __actionType = 'taskData/taskCreated';
      dispatch(
        taskCreated({
          type: __actionType,
          task: {
            ...data.create_kanban_tasks_item,
            status,
          },
          stateAccess,
        })
      );
    }
  };

export const updateTask =
  ({ task, stateAccess }: IUpdateTask): AppThunk =>
  async (dispatch, getState) => {
    // destruct input data
    var { selectedBoard, selectedCol, selectedTask, selectedSubtask } = stateAccess;
    var { id, title, description, status, subtasks } = task;

    if (debug) console.log('taskSlices/updateTask: ', task, stateAccess);

    // Prepare action/request
    var __actionType = 'task/updateTask';
    var __state = getState().taskData;
    // Dispatch Request
    dispatch(itemsRequested({ type: __actionType }));

    // Prepare/perform mutation
    var __col_id;
    var __col_name;
    var __id = (__state as any).boards[selectedBoard].columns[selectedCol].tasks[selectedTask].id;
    (__state as any).boards[selectedBoard].columns.map((col: any, i: any) => {
      console.log('Col: ', col, i);
      if (col.name === status.name) {
        // get col_id
        __col_id = (__state as any).boards[selectedBoard].columns[i].id;
        __col_name = (__state as any).boards[selectedBoard].columns[i].name;
      }
    });
    var __queryScheme = `mutation {
      update_kanban_tasks_item(
        id: ${__id}, 
        data: { 
          column_id: {
            id: ${__col_id} 
          },
          title: "${title}",
          description: "${description}",
          subtasks: [${subtasks.map((subtask: any, i: any) => {
            return subtask.id === ''
              ? `{title: "${subtask.title}", isCompleted: 0}`
              : `{id: "${subtask.id}", title: "${subtask.title}", isCompleted: ${subtask.isCompleted}}`;
          })}
          ]
        }
      ) {
        id
        column_id {
          id
        }
        title
        description
        subtasks {
          id
          title
          isCompleted
        }
      }
    }`;
    var data = await getData(__queryScheme, 'item');

    // send error due to failed get
    if (data.error) {
      dispatch(itemsRequestFailed({ error: data.error.errors[0].message }));
    } else {
      // Load data to store
      dispatch(
        taskUpdated({
          type: __actionType,
          task: {
            ...data.update_kanban_tasks_item,
            status: { id: __col_id, name: __col_name },
          },
          stateAccess,
        })
      );
    }
  };

export const createBoard =
  ({ name, columns }: TPropCreateBoard): AppThunk =>
  async (dispatch) => {
    if (debug) console.log('taskData/createBoard: ', name, columns);

    let actionType = 'board/createBoard';
    // Dispatch Request
    dispatch(itemsRequested({ type: actionType }));

    // Prepare/Perform Mutation
    var queryScheme = `mutation {
      create_boards_item(
        data: {
          name: "${name}",
          columns: [${columns.map((col: any, i: any) => {
            return `{name: "${col.name}", tasks: []}`;
          })}
          ]
        }
      ) {
        id
        name
        columns {
          id
          name
          tasks {
            id
          }
        }
      }
    }`;
    var data = await getData(queryScheme, 'item');

    // send error due to failed get
    if (data.error) {
      dispatch(itemsRequestFailed({ error: data.error.errors[0].message }));
    } else {
      // Load data to store
      dispatch(
        boardCreated({
          type: actionType,
          props: data.create_boards_item,
        })
      );
    }
  };

export const updateBoard =
  ({ id, name, columns }: TPropCreateBoard): AppThunk =>
  async (dispatch) => {
    if (debug) console.log('taskSlices/updateBoard: ', id, name, columns);

    let actionType = 'board/updateBoard';
    // Dispatch Request
    dispatch(itemsRequested({ type: actionType }));

    // Prepare/Perform Mutation
    var queryScheme = `mutation {
      update_boards_item(
        id: ${id},
        data: {
          name: "${name}",
          columns: [${columns.map((col: any, i: any) => {
            return col.id === '' ? `{name: "${col.name}"}` : `{id: "${col.id}", name: "${col.name}"}`;
          })}
          ]
        }
      ) {
        id
        name
        columns {
          id
          name
        }
      }
    }`;
    var data = await getData(queryScheme, 'item');

    // send error due to failed get
    if (data.error) {
      dispatch(itemsRequestFailed({ error: data.error.errors[0].message }));
    } else {
      // Load data to store
      dispatch(
        boardUpdated({
          type: actionType,
          props: data.update_boards_item,
        })
      );
    }
  };

type TaTDI = {
  [key: string]: {
    operation: string;
    reducer: any;
  };
};
var actionTypesDeleteItems: TaTDI = {
  'board/deleteBoard': {
    operation: 'delete_boards_item',
    reducer: 'boardDeleted',
  },
  'tasks/deleteTask': {
    operation: 'delete_kanban_tasks_item',
    reducer: (val: any) => taskDeleted(val),
  },
};

export const deleteItems =
  ({ id, arrNo, val }: TPropDeleteBoard): AppThunk =>
  async (dispatch) => {
    if (debug) console.log('taskSlices/deleteItems: ', id, arrNo, val);

    // determine actionType and query operation
    let actionType: string = val.operation; // e.g. 'board/deleteBoard';
    let queryOperation = actionTypesDeleteItems[actionType].operation; // as keyof TaTDI].operation;
    let reducerMethod = actionTypesDeleteItems[actionType].reducer;

    // Dispatch Request
    dispatch(itemsRequested({ type: actionType }));

    // Prepare/Perform Mutation
    var queryScheme = `mutation {
      ${queryOperation}(id: ${id}) {
        id
      }
    }`;
    var data = await getData(queryScheme, 'item');

    // send error due to failed get
    if (data.error) {
      dispatch(itemsRequestFailed({ error: data.error.errors[0].message }));
    } else {
      // Load data to store
      var fctLoad = {
        type: actionType,
        props: { ...data[queryOperation], arrNo: arrNo, val: val },
      };
      actionType === 'board/deleteBoard'
        ? dispatch(boardDeleted(fctLoad))
        : dispatch(taskDeleted(fctLoad));
    }
  };
