import { toast } from 'react-toastify';

const debug = true;

const toasty = (store) => (next) => (action) => {
  if (debug) console.log('toast: ', action);

  // Requests
  if (action.type === 'taskData/itemsRequested') {
    action.payload.type === 'toast'
      ? toast.success('Database action requested')
      : console.log('Database action requested: ', action.type);
  } else if (action.type === 'taskData/itemsReceived') {
    action.payload.type === 'toast'
      ? toast.success('Database data loaded')
      : console.log('Database data loaded: ', action.payload);
  } else if (action.type === 'taskData/itemsRequestFailed') {
    action.payload.type === 'toast'
      ? toast.error(`${action.payload.error}`)
      : console.log(`${action.payload.error}`);
  } else if (action.type === 'taskData/taskCreated') {
    action.payload.type === 'toast'
      ? toast.success('Task created')
      : console.log('Task created: ', action.payload);
  } else if (action.type === 'taskData/taskUpdated') {
    action.payload.type === 'toast'
      ? toast.success('Task updated')
      : console.log('Task updated: ', action.payload);
  } else if (action.type === 'taskData/boardCreated') {
    action.payload.type === 'toast'
      ? toast.success(`Board "${action.payload.boards?.name}" created`)
      : console.log('Board created: ', action.payload);
  } else if (action.type === 'taskData/boardUpdated') {
    action.payload.type === 'toast'
      ? toast.success(`Board "${action.payload.boards?.name}" updated`)
      : console.log('Board updated: ', action.payload);
  } else if (action.type === 'taskData/taskDeleted') {
    toast.warning(`Task deleted`);
  } else if (action.type === 'taskData/boardDeleted') {
    toast.warning(`Board deleted`);
  } else if (action.type === 'darkModus/darkModusReceived') {
    action.payload.type === 'toast'
      ? action.payload.modus === true
        ? toast.success('Dark Modus enabled')
        : toast.warning('Dark Modus disabled')
      : console.log('Dark Modus setting: ', action.payload.modus);
  }

  return next(action);
};

export default toasty;
