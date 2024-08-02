import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './Components/Header';
import HomeInfo from './Components/Pages/HomeInfo';
import LoginForm from './Components/Pages/Login';
import StartPage from './Components/Pages/Start';
import MessagesContainer from './Components/MessageBox';
import ConfirmEmail from './Components/Pages/ConfirmEmail';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { SessionProvider } from './Components/SessionContext';

const AppContent = () => {
  const location = useLocation();

  const [messages, setMessages] = useState([]);

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

        <Route exact path='emailconfirm/:token/' element={ <ConfirmEmail addMessage={addMessage}/> }/>

        <Route exact path='/start' element={ <StartPage/> }/>
      </Routes>
      <MessagesContainer messages={messages}/>
    </>
  )
}

function App() {
  useEffect(() => {
    document.title = 'Control It';
  },[])

  return (
      <div className="App">
        <BrowserRouter>
          <SessionProvider>
            <AppContent/>
          </SessionProvider>
        </BrowserRouter>

      </div>
  );
}

export default App;