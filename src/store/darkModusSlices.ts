import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from './store';
import axios from 'axios';

const debug = false;

interface IDarkModusState {
  loading: boolean;
  darkModus: boolean;
}

interface IPayloadReceive {
  type: string;
  modus: boolean;
}

// initial state
const initialState: IDarkModusState = {
  loading: false,
  darkModus: false,
};

// create slice
export const slice = createSlice({
  name: 'darkModus',
  initialState,
  reducers: {
    darkModusRequested: (state) => {
      state.loading = true;
    },

    darkModusReceived: (state, action: PayloadAction<IPayloadReceive>) => {
      console.log(action.payload);
      state.darkModus = action.payload.modus;
      state.loading = false;
    },

    darkModusRequestFailed: (state) => {
      state.loading = false;
    },
  },
});

// export reducer
export default slice.reducer;

// export actions
export const { darkModusRequested, darkModusReceived, darkModusRequestFailed } = slice.actions;

interface ISetDarkModus {
  modus: boolean;
}

export const setDarkModus =
  ({ modus }: ISetDarkModus): AppThunk =>
  async (dispatch) => {
    console.log(modus);
    dispatch(darkModusRequested());
    var type = 'toast';
    dispatch(darkModusReceived({ type, modus }));
  };
