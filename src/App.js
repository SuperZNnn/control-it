import React, { useState } from 'react';
import './App.css';
import Header from './Components/Header';
import HomeInfo from './Components/Pages/HomeInfo';
import LoginForm from './Components/Pages/Login';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import MessagesContainer from './Components/MessageBox';

const AppContent = () => {
  const location = useLocation();

  const [messages, setMessages] = useState([])

  const addMessage = (title,paragraph) => {
      const newMessage = { title, paragraph };
      setMessages([...messages, newMessage]);
  }

  return (
    <>
      {location.pathname !== '/start' && (<Header/>)}
      <Routes>
        <Route exact path='/' element={ <HomeInfo/> }/>
        
        <Route exact path='/login' element={ <LoginForm addMessage={addMessage}/> }/>
        <Route exact path='/register' element={ <LoginForm addMessage={addMessage}/> }/>
      </Routes>
      <MessagesContainer messages={messages}/>
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
