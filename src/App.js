import React from 'react';
import './App.css';
import Header from './Components/Header';
import HomeInfo from './Components/Pages/HomeInfo';
import LoginForm from './Components/Pages/Login';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

const AppContent = () => {
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/start' && (<Header/>)}
      <Routes>
        <Route exact path='/' element={ <HomeInfo/> }/>
        <Route exact path='/login' element={ <LoginForm/> }/>
      </Routes>
    </>
  )
}

function App() {
  

  return (
      <div className="App">
        <BrowserRouter>
          <AppContent/>
        </BrowserRouter>

      </div>
  );
}

export default App;
