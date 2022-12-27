import { toast } from 'react-toastify';

const debug = false;

const toasty = (store) => (next) => (action) => {
  if (debug) console.log('toast: ', action);

  // authRequest
  if (action.type === 'auth/authRequestFailed') {
    toast.error(`Login - ${action.payload}`);
  } else if (action.type === 'auth/authReceived') {
    toast.success(`Login erfolgreich`);
  } else if (action.type === 'auth/loggedOut') {
    toast.success('Logout erfolgreich');
  }

  return next(action);
};

export default toasty;
