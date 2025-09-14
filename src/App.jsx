import React from 'react';
import { BrowserRouter ,  Route, Routes } from 'react-router-dom';
import Home from './components/home/Home';
import Login from './components/Log/Login';
import Signup from './components/Log/Signup';
import ForgotPassword from './components/Log/ForgotPassword';


const App = () => {
  
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/forgot-password' element={<ForgotPassword/>}/>
      </Routes>
    </BrowserRouter>
  )
};

export default App;