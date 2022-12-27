const logger = (store) => (next) => (action) => {
  //console.log('Logging to: ', action);
  next(action);
};

export default logger;
