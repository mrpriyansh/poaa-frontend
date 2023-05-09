import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ReactComponent as LoaderSVG } from './assets/icons/spinner.svg';
import popupReducer from './redux/popup';

const store = configureStore({
  reducer: {
    popup: popupReducer,
  },
});

ReactDOM.render(
  <Suspense fallback={<LoaderSVG />}>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </Suspense>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
