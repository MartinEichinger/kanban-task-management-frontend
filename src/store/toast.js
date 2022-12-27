import { toast } from 'react-toastify';

const debug = true;

const toasty = (store) => (next) => (action) => {
  if (debug) console.log('toast: ', action);

  // authRequest
  if (action.type === 'auth/authRequestFailed') {
    toast.error(`Login - ${action.payload}`);
  } else if (action.type === 'auth/authReceived') {
    toast.success(`Login erfolgreich`);
  } else if (action.type === 'auth/loggedOut') {
    toast.success('Logout erfolgreich');
  } else if (action.type === 'taskData/itemsReceived') {
    toast.success('Database data loaded');
  } else if (action.type === 'taskData/itemsRequestFailed') {
    toast.error(`${action.payload.error}`);
  } else if (action.type === 'taskData/boardCreated') {
    toast.success(`Board "${action.payload.props.name}" created`);
  } else if (action.type === 'taskData/taskDeleted') {
    toast.warning(`Task deleted`);
  } else if (action.type === 'taskData/boardDeleted') {
    toast.warning(`Board deleted`);
  }

  return next(action);
};

export default toasty;
