import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import Playlists from './Playlists';
import PlaylistItems from './PlaylistItems.jsx';
import {AuthProvider} from './context/AuthProvider.jsx';
import {Toaster} from 'react-hot-toast';
import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  RouterProvider,
} from 'react-router-dom';
import './index.css';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Playlists />} />
      <Route path="playlist/:playlistId" element={<PlaylistItems />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <Toaster position="bottom-center" />
    <RouterProvider router={router} />
  </AuthProvider>
);
