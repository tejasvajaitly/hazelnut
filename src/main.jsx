import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import Test from './Test.jsx';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: 'test',
    element: <Test />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(<RouterProvider router={router} />);
