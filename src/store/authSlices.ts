import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from './store';
import axios from 'axios';

const debug = false;
const authkey = process.env.REACT_APP_AUTH_KEY;

interface authState {
  loading?: boolean;
  token: string | null;
  user_email: string | null;
}

interface Auth {
  token: string | null;
  user_email: string | null;
}

// initial state
const initialState: authState = {
  loading: false,
  token: null,
  user_email: null,
};

// create slice
export const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loggedOut: (state) => {
      if (debug) console.log('auth/loggedOut', state);
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('expirationDate');
      state.token = null;
      state.user_email = null;
    },

    authStatus: (state) => {
      if (localStorage.getItem('token') != null) {
        const actTime = new Date(new Date().getTime());
        const storTime = new Date(localStorage.getItem('expirationDate') as string);
        if (storTime.getTime() > actTime.getTime()) {
          state.token = localStorage.getItem('token');
          state.user_email = localStorage.getItem('username');
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          localStorage.removeItem('expirationDate');
        }
      }
    },

    authReceived: (state, action: PayloadAction<Auth>) => {
      const { token, user_email } = action.payload;
      state.token = token;
      state.user_email = user_email;
      state.loading = false;

      const expirationDate = new Date(new Date().getTime() + 3600 * 1000) as unknown;

      localStorage.setItem('token', token as string);
      localStorage.setItem('user_email', user_email as string);
      localStorage.setItem('expirationDate', expirationDate as string);
    },

    authRequested: (state) => {
      state.loading = true;
    },

    authRequestFailed: (state, action) => {
      state.loading = false;
    },
  },
});

// export reducer
export default slice.reducer;

// export actions
export const { loggedOut, authStatus, authReceived, authRequested, authRequestFailed } = slice.actions;

interface IAuthData {
  email: string;
  password: string;
}

export const logIn =
  ({ email, password }: IAuthData): AppThunk =>
  async (dispatch) => {
    dispatch(authRequested());
    let method = 'POST';
    let url = `https://audiophile.edmadd.eu/?rest_route=/simple-jwt-login/v1/auth&email=${email}&password=${password}&authkey=${authkey}`;

    return axios
      .request({
        method: method,
        url: url,
      })
      .then((res) => {
        console.log('res:', res);
        const user_email: string = email;
        const jwt: string = res.data.data.jwt;

        let data = { user_email: user_email, token: jwt };
        dispatch(authReceived(data));
      })
      .catch((err) => {
        console.log(err);
        dispatch(authRequestFailed(err));
      });
  };

export const logOut = (): AppThunk => async (dispatch) => {
  dispatch(loggedOut());
};

export const signUp =
  ({ email, password }: IAuthData): AppThunk =>
  async (dispatch) => {
    let method = 'POST';
    let url = `https://audiophile.edmadd.eu/?rest_route=/simple-jwt-login/v1/users&email=${email}&password=${password}&authkey=${authkey}`;

    return axios
      .request({
        method: method,
        url: url,
      })
      .then((res) => {
        console.log('res:', res);
        const user_email = res.data.user.user_email;
        const jwt = res.data.jwt;

        let data = { user_email: user_email, token: jwt };
        dispatch(authReceived(data));
      })
      .catch((err) => {
        dispatch(authRequestFailed(err));
      });
  };

// export action creators
//const url = '/rest-auth/login/';

/* export const logIn = (username, password) => (dispatch) => {
  if (debug) console.log('auth/logIn');
  dispatch(
    apiCallBegan({
      url,
      method: 'post',
      data: { username, password },
      onStart: authRequested.type,
      onSuccess: authReceived.type,
      onError: authRequestFailed.type,
    })
  );
  dispatch(checkAuthTimeout(3600));
}; */

/* export const logOut = () => (dispatch) => {
  dispatch(loggedOut());
};

export const checkAuthTimeout = (expirationDate) => (dispatch) => {
  console.log('Start timeout: ', expirationDate);
  setTimeout(() => {
    dispatch(loggedOut());
  }, expirationDate * 1000);
}; */

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
//export const isAuthenticated = (state) => state.auth.token !== null;
