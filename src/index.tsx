import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { ThemeProvider } from './ThemeProvider/ThemeProvider';
import { SelectStatusProvider } from './SelectStatusProvider/SelectStatusProvider';
import { ModalStatusProvider } from './ModalStatusProvider/ModalStatusProvider';
import { store } from './store/store';
import { ToastContainer } from 'react-toastify';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-toastify/dist/ReactToastify.css';

import { Amplify } from 'aws-amplify';
import config from './aws-exports';
Amplify.configure(config);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <Provider store={store}>
    <ThemeProvider>
      <SelectStatusProvider>
        <ModalStatusProvider>
          <ToastContainer />
          <App />
        </ModalStatusProvider>
      </SelectStatusProvider>
    </ThemeProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

//   <React.StrictMode>
