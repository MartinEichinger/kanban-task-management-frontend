import { configureStore, Action } from '@reduxjs/toolkit';
import taskDataReducer from './taskSlices';
import darkModusReducer from './darkModusSlices';

import logger from './logger';
import toast from './toast';
//TEST
import { ThunkAction } from 'redux-thunk';

export const store = configureStore({
  reducer: {
    taskData: taskDataReducer,
    darkModus: darkModusReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger, toast),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
//TEST
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;
