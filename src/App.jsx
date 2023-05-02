import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Play from './pages/Play/Play';
import Dashboard from './pages/Dashboard/Dashboard';
import PrivateRoute from './route/PrivateRoute';
import Signup from './pages/Signup/Signup';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Details from './pages/Details/Details';
import Advance from './pages/Advance/Advance';
import Results from './pages/Results/Results';
import PlayerResult from './pages/PlayerResult/PlayerResult';

function App () {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      <Route path="/play" element={<Play />} />
      <Route path="/details/:id" element={<Details />} />
      <Route path="/advance/:id" element={<Advance />} />
      <Route path="/results/:id" element={<Results />} />
      <Route path="/player/results/:playerId" element={<PlayerResult />} />
    </Routes>
  </BrowserRouter>
  <ToastContainer />
    </>
  );
}

export default App;
